from django.urls import path, include
from rest_framework import routers
from .views import TempOnboardingView
from .views import RegisterView
from .views import UserMeView
from .views import (
    VehicleViewSet, LocationViewSet, RequirementViewSet, RentalViewSet,
    RentalTicketViewSet, ReturnRequestViewSet, DropoffChangeRequestViewSet,
    RenewalRequestViewSet, RentalStatusLogViewSet,DealerContactViewSet,TempOnboardingView, VerifyOTPView

)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'requirements', RequirementViewSet)
router.register(r'rentals', RentalViewSet)
router.register(r'tickets', RentalTicketViewSet)
router.register(r'return-requests', ReturnRequestViewSet)
router.register(r'dropoff-changes', DropoffChangeRequestViewSet)
router.register(r'renewals', RenewalRequestViewSet)
router.register(r'status-logs', RentalStatusLogViewSet)
router.register(r'dealer-contacts', DealerContactViewSet, basename='dealer-contact')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='api-register'),
    path('api/user/me/', UserMeView.as_view(), name='user-me'),
    path("api/onboarding/temp/", TempOnboardingView.as_view(), name="temp-onboarding"),
    path("api/onboarding/verify-otp/", VerifyOTPView.as_view(), name="verify-otp")
]

