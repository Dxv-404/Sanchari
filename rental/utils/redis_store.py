# rental/utils/redis_store.py

import json
import uuid
from django.core.cache import cache
from django.core.files.storage import default_storage

ONBOARDING_TTL_SECONDS = 300  # 5 minutes

def store_temp_user(data):
    session_id = str(uuid.uuid4())

    # Handle all uploads: profile pic, aadhar front/back, license
    file_fields = {}
    file_keys = ['profile_picture', 'aadhar_front', 'aadhar_back', 'license']
    for key in file_keys:
        if key in data and data[key]:
            filename = f'onboarding_temp/{session_id}_{key}_{data[key].name}'
            path = default_storage.save(filename, data[key])
            file_fields[key] = default_storage.url(path)
        else:
            file_fields[key] = None

    safe_data = {
        'full_name': data.get('full_name'),
        'age': data.get('age'),
        'gender': data.get('gender'),
        'contact_number': data.get('contact_number'),
        'no_license': data.get('no_license', False),
        **file_fields
    }

    cache.set(f"onboarding:{session_id}", json.dumps(safe_data), timeout=ONBOARDING_TTL_SECONDS)
    return session_id

def get_temp_user(session_id):
    key = f"onboarding:{session_id}"
    raw_data = cache.get(key)
    if raw_data:
        return json.loads(raw_data)
    return None

def delete_all(session_id):
    cache.delete_many([
        f"onboarding:{session_id}",
        f"onboarding:{session_id}:otp"
    ])
