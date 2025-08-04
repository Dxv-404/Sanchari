from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
VEHICLE_TYPE_CHOICES = [
    ('car', 'Car'),
    ('bike', 'Bike'),
    ('scooter', 'Scooter'),
]

CONDITION_CHOICES = [
    ('new', 'New'),
    ('used', 'Used'),
]

FUEL_TYPE_CHOICES = [
    ('petrol', 'Petrol'),
    ('diesel', 'Diesel'),
    ('electric', 'Electric'),
    ('hybrid', 'Hybrid'),
]

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    contact_number = models.CharField(max_length=15, unique=True)
    profile_picture = models.ImageField(upload_to="documents/profile_pictures/", null=True, blank=True)
    aadhar_front = models.FileField(upload_to="documents/aadhar/", null=True, blank=True)
    aadhar_back = models.FileField(upload_to="documents/aadhar/", null=True, blank=True)
    license = models.FileField(upload_to="documents/license/", null=True, blank=True)
    no_license = models.BooleanField(default=False)

    onboarded = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class DealerContact(models.Model):
    name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"

class Location(models.Model):
    location_name = models.CharField(max_length=255)
    city = models.CharField(max_length=80)
    district = models.CharField(max_length=80)
    state = models.CharField(max_length=80)

    def __str__(self):
        return f"{self.location_name}, {self.city}, {self.state}"

class Requirement(models.Model):
    ICON_CHOICES = [
        ('license', 'Driving License'),
        ('age', 'Age Restriction'),
        ('citizen', 'Nationality'),
        ('deposit', 'Deposit Required'),
        ('helmet', 'Helmet Required'),
    ]
    vehicle = models.ForeignKey('Vehicle', related_name='requirements', on_delete=models.CASCADE)
    icon = models.CharField(max_length=30, choices=ICON_CHOICES)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.get_icon_display()}: {self.text}"

class Vehicle(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='vehicle_images/')
    type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    year = models.PositiveIntegerField()
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPE_CHOICES)
    power = models.CharField(max_length=30)  
    description = models.TextField("Description", max_length=2000)
    price_daily = models.DecimalField("Daily Price", max_digits=10, decimal_places=2)
    price_weekly = models.DecimalField("Weekly Price", max_digits=10, decimal_places=2, blank=True, null=True)
    price_monthly = models.DecimalField("Monthly Price", max_digits=10, decimal_places=2, blank=True, null=True)
    city = models.CharField(max_length=80, blank=True, null=True)
    district = models.CharField(max_length=80, blank=True, null=True)
    state = models.CharField(max_length=80, blank=True, null=True)
    available = models.BooleanField(default=True)
    pickup_locations = models.ManyToManyField('Location', related_name="pickup_vehicles", blank=True)
    dropoff_locations = models.ManyToManyField('Location', related_name="dropoff_vehicles", blank=True)
    stock_left = models.PositiveIntegerField(default=1)
    dealer_contact = models.ForeignKey(DealerContact, null=True, blank=True, on_delete=models.SET_NULL)
    location_tags = models.JSONField(default=list, blank=True)
    mileage = models.DecimalField("Mileage", max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.stock_left == 0:
            self.available = False
        if self.price_daily:
            if not self.price_weekly:
                self.price_weekly = self.price_daily * 7
            if not self.price_monthly:
                self.price_monthly = self.price_daily * 30
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Rental(models.Model):
    RENTAL_TYPE_CHOICES = [
        ('day', 'Day'),
        ('week', 'Week'),
        ('month', 'Month'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('returned', 'Returned'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
        ('renewed', 'Renewed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rentals')
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='rentals')
    rental_type = models.CharField(max_length=8, choices=RENTAL_TYPE_CHOICES)
    pickup_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='pickup_rentals')
    dropoff_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='dropoff_rentals')
    pickup_date = models.DateField()
    dropoff_date = models.DateField()
    pickup_time = models.TimeField(blank=True, null=True)
    dropoff_time = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    ticket_id = models.CharField(max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    return_reason = models.TextField(blank=True, null=True)
    returned = models.BooleanField(default=False)
    dropoff_on_time = models.BooleanField(default=True)

    def days_left(self):
        from datetime import date
        if self.dropoff_date:
            return (self.dropoff_date - date.today()).days
        return 0

    def __str__(self):
        return f"Rental {self.ticket_id}: {self.vehicle} for {self.user} ({self.pickup_date} to {self.dropoff_date})"

class ReturnRequest(models.Model):
    rental = models.OneToOneField(Rental, on_delete=models.CASCADE, related_name='return_request')
    return_reason = models.TextField()
    new_dropoff_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='return_requests')
    issue_reported = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class DropoffChangeRequest(models.Model):
    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='dropoff_changes')
    old_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='old_dropoff_changes')
    new_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='new_dropoff_changes')
    created_at = models.DateTimeField(auto_now_add=True)

class RenewalRequest(models.Model):
    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='renewal_requests')
    requested_duration = models.CharField(max_length=8, choices=Rental.RENTAL_TYPE_CHOICES)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class RentalTicket(models.Model):
    rental = models.OneToOneField(Rental, on_delete=models.CASCADE, related_name='ticket')
    issued_at = models.DateTimeField(auto_now_add=True)
    ticket_number = models.CharField(max_length=36, unique=True)
    pickup_date = models.DateField()
    dropoff_date = models.DateField()
    dropoff_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='ticket_dropoffs')
    vehicle_snapshot = models.JSONField()

    def __str__(self):
        return f"Ticket {self.ticket_number}"

class RentalStatusLog(models.Model):
    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='status_logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    from_status = models.CharField(max_length=10, choices=Rental.STATUS_CHOICES)
    to_status = models.CharField(max_length=10, choices=Rental.STATUS_CHOICES)
    triggered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='status_changes')

    def __str__(self):
        return f"{self.rental} - {self.from_status} → {self.to_status} at {self.timestamp}"
    