# rental/utils/otp_d7.py

import random
import time
import requests
import json
from django.core.cache import cache
from django.conf import settings

OTP_TTL = 300
MAX_ATTEMPTS = 5

def generate_otp():
    return random.randint(100000, 999999)

def send_otp(phone_number, session_id):
    otp_code = str(generate_otp())
    expires_at = time.time() + OTP_TTL

    # Save OTP to Redis
    cache.set(f"onboarding:{session_id}:otp", json.dumps({
        "code": otp_code,
        "attempts": 0,
        "expires_at": expires_at
    }), timeout=OTP_TTL)

    # D7 Verify API
    url = "https://d7-verify.p.rapidapi.com/verify/v1/otp/send-otp"
    payload = {
        "originator": "SignOTP",
        "recipient": f"+91{phone_number}",
        "content": f"Your Rentavec OTP is {otp_code}",
        "expiry": "300",
        "data_coding": "text"
    }

    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": settings.D7_API_KEY,
        "X-RapidAPI-Host": "d7-verify.p.rapidapi.com"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        print("🔁 D7 OTP Status Code:", response.status_code)
        print("📩 D7 OTP Response:", response.text)

        return response.status_code == 200
    except Exception as e:
        print("❌ D7 OTP Exception:", e)
        return False


def verify_otp(input_code, session_id):
    raw = cache.get(f"onboarding:{session_id}:otp")
    if not raw:
        return False, "OTP expired"

    data = json.loads(raw)
    if time.time() > data["expires_at"]:
        delete_all(session_id)
        return False, "OTP expired"

    if data["attempts"] >= MAX_ATTEMPTS:
        delete_all(session_id)
        return False, "Too many attempts"

    if input_code == data["code"]:
        return True, "OTP verified"
    else:
        data["attempts"] += 1
        cache.set(f"onboarding:{session_id}:otp", json.dumps(data), timeout=OTP_TTL)
        return False, f"Incorrect OTP. Attempt {data['attempts']} of {MAX_ATTEMPTS}"

def delete_all(session_id):
    cache.delete_many([
        f"onboarding:{session_id}",
        f"onboarding:{session_id}:otp"
    ])

def generate_otp():
    from random import randint
    return randint(100000, 999999)
