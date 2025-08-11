from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.db.models import Q, Min, Max
from django.contrib.auth import get_user_model

from .models import (
    Vehicle, Location, Requirement, Rental, RentalTicket,
    ReturnRequest, DropoffChangeRequest, RenewalRequest, RentalStatusLog, DealerContact,Wishlist
)
from .serializers import (
    RegisterSerializer, UserSerializer,
    VehicleSerializer, LocationSerializer, RequirementSerializer, RentalSerializer, RentalTicketSerializer,
    ReturnRequestSerializer, DropoffChangeRequestSerializer, RenewalRequestSerializer, RentalStatusLogSerializer,
    DealerContactSerializer,WishlistSerializer
    
)

User = get_user_model()

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by("-id")
    serializer_class = VehicleSerializer

    def get_permissions(self):
        if self.action in ['destroy', 'create', 'update', 'partial_update']:
            return [IsAdminUser()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("🔴 VEHICLE CREATE VALIDATION ERROR:", serializer.errors)
            return Response(serializer.errors, status=400)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def list(self, request, *args, **kwargs):
        qs = Vehicle.objects.all().distinct()

        q = request.query_params.get("q")
        if q:
            qs = qs.filter(
                Q(name__icontains=q) |
                Q(city__icontains=q) |
                Q(district__icontains=q) |
                Q(state__icontains=q) |
                Q(location_tags__icontains=q) |
                Q(pickup_locations__city__icontains=q) |
                Q(dropoff_locations__city__icontains=q)
            )

        def split_list(key):
            val = request.query_params.get(key)
            return [s.strip() for s in val.split(",") if s.strip()] if val else []

        types = split_list("types")
        fuels = split_list("fuels")
        conditions = split_list("conditions")
        cities = split_list("cities")

        if types:
            qs = qs.filter(type__in=types)
        if fuels:
            qs = qs.filter(fuel_type__in=fuels)
        if conditions:
            qs = qs.filter(condition__in=conditions)
        if cities:
            qs = qs.filter(Q(city__in=cities) | Q(pickup_locations__city__in=cities) | Q(dropoff_locations__city__in=cities))

        pmin = request.query_params.get("price_min")
        pmax = request.query_params.get("price_max")
        if pmin:
            qs = qs.filter(price_daily__gte=pmin)
        if pmax:
            qs = qs.filter(price_daily__lte=pmax)

        mmin = request.query_params.get("mileage_min")
        mmax = request.query_params.get("mileage_max")
        if mmin:
            qs = qs.filter(mileage__gte=mmin)
        if mmax:
            qs = qs.filter(mileage__lte=mmax)

        available = request.query_params.get("available")
        if available == "true":
            qs = qs.filter(available=True)

        ordering = request.query_params.get("ordering")
        if ordering:
            qs = qs.order_by(ordering)

        # paging (for infinite scroll)
        try:
            limit = int(request.query_params.get("limit") or 0)
            offset = int(request.query_params.get("offset") or 0)
        except ValueError:
            limit = 0
            offset = 0

        qs = qs.order_by("-id").distinct()
        if limit:
            qs = qs[offset: offset + limit]

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # /api/vehicles/meta/
    @action(detail=False, methods=["get"])
    def meta(self, request):
        agg = Vehicle.objects.aggregate(
            min_price=Min("price_daily"),
            max_price=Max("price_daily"),
            min_mileage=Min("mileage"),
            max_mileage=Max("mileage"),
        )
        types = list(Vehicle.objects.order_by().values_list("type", flat=True).distinct())
        fuels = list(Vehicle.objects.order_by().values_list("fuel_type", flat=True).distinct())
        conditions = list(Vehicle.objects.order_by().values_list("condition", flat=True).distinct())
        cities = list(
            Vehicle.objects.exclude(city__isnull=True).exclude(city__exact="")
            .order_by("city").values_list("city", flat=True).distinct()
        )[:80]
        return Response({
            "min_price": agg["min_price"] or 0,
            "max_price": agg["max_price"] or 0,
            "min_mileage": agg["min_mileage"] or 0,
            "max_mileage": agg["max_mileage"] or 0,
            "types": types, "fuels": fuels, "conditions": conditions, "cities": cities
        })

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RequirementViewSet(viewsets.ModelViewSet):
    queryset = Requirement.objects.all()
    serializer_class = RequirementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RentalViewSet(viewsets.ModelViewSet):
    queryset = Rental.objects.all()
    serializer_class = RentalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Rental.objects.all()
        return Rental.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RentalTicketViewSet(viewsets.ModelViewSet):
    queryset = RentalTicket.objects.all()
    serializer_class = RentalTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReturnRequestViewSet(viewsets.ModelViewSet):
    queryset = ReturnRequest.objects.all()
    serializer_class = ReturnRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class DropoffChangeRequestViewSet(viewsets.ModelViewSet):
    queryset = DropoffChangeRequest.objects.all()
    serializer_class = DropoffChangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class RenewalRequestViewSet(viewsets.ModelViewSet):
    queryset = RenewalRequest.objects.all()
    serializer_class = RenewalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class RentalStatusLogViewSet(viewsets.ModelViewSet):
    queryset = RentalStatusLog.objects.all()
    serializer_class = RentalStatusLogSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterView(APIView):
    permission_classes = []  # AllowAny by default

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class DealerContactViewSet(viewsets.ModelViewSet):
    queryset = DealerContact.objects.all()
    serializer_class = DealerContactSerializer
    permission_classes = [IsAdminUser]

# ✅ New: Direct onboarding completion (no OTP, no temp/redis)
class CompleteOnboardingView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Simple helpers to pull fields and files
        def get_bool(name, default=False):
            raw = request.data.get(name)
            if isinstance(raw, bool):
                return raw
            return str(raw).lower() == "true" if raw is not None else default

        # Assign scalar fields
        user.full_name = request.data.get("full_name") or user.full_name
        user.age = request.data.get("age") or user.age
        user.gender = request.data.get("gender") or user.gender
        user.contact_number = request.data.get("contact_number") or user.contact_number
        user.no_license = get_bool("no_license", user.no_license)

        # Assign files if provided
        if "profile_picture" in request.FILES:
            user.profile_picture = request.FILES["profile_picture"]
        if "aadhar_front" in request.FILES:
            user.aadhar_front = request.FILES["aadhar_front"]
        if "aadhar_back" in request.FILES:
            user.aadhar_back = request.FILES["aadhar_back"]
        # Only save license if user is not marking no_license
        if not user.no_license and "license" in request.FILES:
            user.license = request.FILES["license"]

        # Mark as onboarded
        user.onboarded = True
        user.save()

        return Response(UserSerializer(user).data, status=200)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related("vehicle")

    def create(self, request, *args, **kwargs):
        vehicle_id = request.data.get("vehicle_id")
        if not vehicle_id:
            return Response({"detail": "vehicle_id is required"}, status=400)
        wishlist, created = Wishlist.objects.get_or_create(user=request.user, vehicle_id=vehicle_id)
        if not created:
            return Response({"detail": "Already in wishlist"}, status=200)
        serializer = self.get_serializer(wishlist)
        return Response(serializer.data, status=201)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)
