from rest_framework import viewsets, permissions 
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from .models import DealerContact
from .serializers import DealerContactSerializer
from .serializers import TempOnboardingSerializer
from .utils.redis_store import store_temp_user, get_temp_user, delete_all
from .utils.otp_d7 import send_otp
from django.contrib.auth import get_user_model
from .utils.otp_d7 import verify_otp, delete_all
from rest_framework.permissions import AllowAny
from django.core.files.storage import default_storage
from django.core.files.base import File
from uuid import uuid4
from rest_framework.parsers import MultiPartParser, FormParser

User=get_user_model()

from .models import (
    Vehicle, Location, Requirement, Rental, RentalTicket,
    ReturnRequest, DropoffChangeRequest, RenewalRequest, RentalStatusLog
)
from .serializers import (
    VehicleSerializer, LocationSerializer, RequirementSerializer, RentalSerializer, RentalTicketSerializer,
    ReturnRequestSerializer, DropoffChangeRequestSerializer, RenewalRequestSerializer, RentalStatusLogSerializer
)

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
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
    permission_classes = []  

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


class TempOnboardingView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]
    def post(self, request):
        def save_file(file_obj, suffix):
            if file_obj:
                return default_storage.save(f"onboarding/{uuid4()}_{suffix}", file_obj)
            return None
        profile_picture = request.FILES.get("profile_picture")
        aadhar_front = request.FILES.get("aadhar_front")
        aadhar_back = request.FILES.get("aadhar_back")
        license_file = request.FILES.get("license")
        form_data = {
            "full_name": request.data.get("full_name"),
            "age": request.data.get("age"),
            "gender": request.data.get("gender"),
            "contact_number": request.data.get("contact_number"),
            "no_license": request.data.get("no_license") == "true",
            "profile_picture_path": save_file(profile_picture, "profile.jpg"),
            "aadhar_front_path": save_file(aadhar_front, "aadhar_front.jpg"),
            "aadhar_back_path": save_file(aadhar_back, "aadhar_back.jpg"),
            "license_path": save_file(license_file, "license.jpg") if request.data.get("no_license") != "true" else None
        }
        session_id = store_temp_user(form_data)
        return Response({
            "message": "Temporary data saved",
            "session_id": session_id,
            "phone": form_data["contact_number"]
        }, status=200)



class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        session_id = request.data.get("session_id")
        data = get_temp_user(session_id)
        if not data:
            return Response({"error": "Session expired or invalid"}, status=404)
        def load_file(path):
            if path and default_storage.exists(path):
                return File(default_storage.open(path, 'rb'))
            return None
        profile_file = load_file(data.get("profile_picture_path"))
        aadhar_f = load_file(data.get("aadhar_front_path"))
        aadhar_b = load_file(data.get("aadhar_back_path"))
        license_file = load_file(data.get("license_path"))
        user = User.objects.create_user(
            username=data["contact_number"],
            full_name=data["full_name"],
            age=data["age"],
            gender=data["gender"],
            contact_number=data["contact_number"],
            onboarded=True
        )
        if profile_file:
            user.profile_picture.save(f"{user.id}_profile.jpg", profile_file)
        if aadhar_f:
            user.aadhar_front.save(f"{user.id}_aadhar_front.jpg", aadhar_f)
        if aadhar_b:
            user.aadhar_back.save(f"{user.id}_aadhar_back.jpg", aadhar_b)
        if license_file and not data.get("no_license"):
            user.license_image.save(f"{user.id}_license.jpg", license_file)
        user.save()
        delete_all(session_id)
        return Response({"message": "User created successfully"}, status=201)
