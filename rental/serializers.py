from rest_framework import serializers
import json
from django.contrib.auth import get_user_model
from .models import (
    Vehicle, Location, Requirement, Rental, RentalTicket,
    ReturnRequest, DropoffChangeRequest, RenewalRequest, RentalStatusLog,
    DealerContact
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirement
        fields = ['icon', 'text']

class DealerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerContact
        fields = '__all__'
class VehicleSerializer(serializers.ModelSerializer):
    pickup_locations = serializers.PrimaryKeyRelatedField(many=True, queryset=Location.objects.all(), required=False)
    dropoff_locations = serializers.PrimaryKeyRelatedField(many=True, queryset=Location.objects.all(), required=False)
    requirements = RequirementSerializer(many=True, required=False)
    dealer_contact = serializers.PrimaryKeyRelatedField(
        queryset=DealerContact.objects.all(),
        required=False,
        allow_null=True
    )

    pickup_locations_full = LocationSerializer(many=True, source='pickup_locations', read_only=True)
    dropoff_locations_full = LocationSerializer(many=True, source='dropoff_locations', read_only=True)
    requirements_full = RequirementSerializer(many=True, source='requirements', read_only=True)
    dealer_contact_full = DealerContactSerializer(source='dealer_contact', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = '__all__'

    def create(self, validated_data):
        pickup_data = self.initial_data.get('pickup_locations')
        dropoff_data = self.initial_data.get('dropoff_locations')
        requirements_data = self.initial_data.get('requirements')
        dealer_data_raw = self.initial_data.get('dealer_contact')

        if isinstance(pickup_data, str):
            pickup_data = json.loads(pickup_data)
        if isinstance(dropoff_data, str):
            dropoff_data = json.loads(dropoff_data)
        if isinstance(requirements_data, str):
            requirements_data = json.loads(requirements_data)
        dealer_data = json.loads(dealer_data_raw) if dealer_data_raw else None

        validated_data.pop('requirements', None)
        validated_data.pop('pickup_locations', None)
        validated_data.pop('dropoff_locations', None)
        validated_data.pop('dealer_contact', None)

        vehicle = Vehicle.objects.create(**validated_data)

        if dealer_data:
            phone = dealer_data.get('phone')
            try:
                contact = DealerContact.objects.get(phone=phone)
            except DealerContact.DoesNotExist:
                contact = DealerContact.objects.create(**dealer_data)
            vehicle.dealer_contact = contact
            vehicle.save()

        if pickup_data is not None:
            vehicle.pickup_locations.set(pickup_data)
        if dropoff_data is not None:
            vehicle.dropoff_locations.set(dropoff_data)
        if requirements_data:
            for req in requirements_data:
                Requirement.objects.create(vehicle=vehicle, **req)

        return vehicle

    def update(self, instance, validated_data):
        import json
        initial = self.initial_data

        # ✅ Robust Dealer Contact Handling (ID, Dict, or JSON string)
        dealer_data_raw = initial.get("dealer_contact")
        validated_data.pop("dealer_contact", None)

        contact = None
        if dealer_data_raw:
            # If it's a JSON string
            if isinstance(dealer_data_raw, str):
                try:
                    dealer_data = json.loads(dealer_data_raw)
                except Exception:
                    dealer_data = None
            # If it's a Python dict
            elif isinstance(dealer_data_raw, dict):
                dealer_data = dealer_data_raw
            # If it's an ID (int)
            elif isinstance(dealer_data_raw, int):
                try:
                    contact = DealerContact.objects.get(id=dealer_data_raw)
                except DealerContact.DoesNotExist:
                    contact = None
                dealer_data = None
            else:
                dealer_data = None

            # If dict contains ID, fetch by ID
            if dealer_data and dealer_data.get("id"):
                try:
                    contact = DealerContact.objects.get(id=dealer_data["id"])
                except DealerContact.DoesNotExist:
                    contact = None

            # If no ID-based contact found, try get_or_create by phone
            if not contact and dealer_data and dealer_data.get("phone"):
                phone = dealer_data["phone"]
                contact, _ = DealerContact.objects.get_or_create(phone=phone, defaults=dealer_data)

            # Assign to instance if resolved
            if contact:
                instance.dealer_contact = contact

        # ✅ Handle Pickup Locations
        pickup_ids = initial.get("pickup_locations")
        if isinstance(pickup_ids, str):
            pickup_ids = json.loads(pickup_ids)
        validated_data.pop("pickup_locations", None)
        if pickup_ids is not None:
            instance.pickup_locations.set(pickup_ids)

        # ✅ Handle Dropoff Locations
        dropoff_ids = initial.get("dropoff_locations")
        if isinstance(dropoff_ids, str):
            dropoff_ids = json.loads(dropoff_ids)
        validated_data.pop("dropoff_locations", None)
        if dropoff_ids is not None:
            instance.dropoff_locations.set(dropoff_ids)

        # ✅ Handle Requirements
        requirements_data = initial.get("requirements")
        if isinstance(requirements_data, str):
            requirements_data = json.loads(requirements_data)
        validated_data.pop("requirements", None)
        if requirements_data is not None:
            instance.requirements.all().delete()
            for req in requirements_data:
                Requirement.objects.create(vehicle=instance, **req)

        # ✅ Handle Location Tags
        location_tags = initial.get("location_tags")
        if isinstance(location_tags, str):
            location_tags = json.loads(location_tags)
        validated_data.pop("location_tags", None)
        if location_tags is not None:
            instance.location_tags = location_tags

        # ✅ Apply remaining fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class TempOnboardingSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    age = serializers.IntegerField()
    gender = serializers.ChoiceField(choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")])
    contact_number = serializers.CharField()
    profile_picture = serializers.FileField(required=False, allow_null=True)
    aadhar_front = serializers.FileField(required=True)
    aadhar_back = serializers.FileField(required=True)
    license = serializers.FileField(required=False, allow_null=True)
    no_license = serializers.BooleanField(required=False)


class RentalTicketSerializer(serializers.ModelSerializer):
    dropoff_location = LocationSerializer(read_only=True)

    class Meta:
        model = RentalTicket
        fields = '__all__'

class RentalSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    pickup_location = LocationSerializer(read_only=True)
    dropoff_location = LocationSerializer(read_only=True)
    ticket = RentalTicketSerializer(read_only=True)

    class Meta:
        model = Rental
        fields = '__all__'

class ReturnRequestSerializer(serializers.ModelSerializer):
    rental = RentalSerializer(read_only=True)
    new_dropoff_location = LocationSerializer(read_only=True)

    class Meta:
        model = ReturnRequest
        fields = '__all__'

class DropoffChangeRequestSerializer(serializers.ModelSerializer):
    rental = RentalSerializer(read_only=True)
    old_location = LocationSerializer(read_only=True)
    new_location = LocationSerializer(read_only=True)

    class Meta:
        model = DropoffChangeRequest
        fields = '__all__'

class RenewalRequestSerializer(serializers.ModelSerializer):
    rental = RentalSerializer(read_only=True)

    class Meta:
        model = RenewalRequest
        fields = '__all__'

class RentalStatusLogSerializer(serializers.ModelSerializer):
    rental = RentalSerializer(read_only=True)
    triggered_by = UserSerializer(read_only=True)

    class Meta:
        model = RentalStatusLog
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
