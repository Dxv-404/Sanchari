// OnboardingStep1.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Calendar, Image, ChevronDown } from "lucide-react";
import "../../components/users/onboarding/Onboarding.css";
import AvatarUpload from "../../components/users/onboarding/AvatarUpload";
import CountryCodeDropdown from "../../components/users/onboarding/CountryCodeDropdown";

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    contact_number: "",
    country_code: "+91",
    profile_picture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (code, number) => {
    setForm((prev) => ({ ...prev, country_code: code, contact_number: number }));
  };

  const handleAvatar = (file) => {
    setForm((prev) => ({ ...prev, profile_picture: file }));
  };

  const isValid =
    form.full_name &&
    form.age &&
    form.gender &&
    form.contact_number.length >= 6;

  const handleNext = () => {
    localStorage.setItem("onboarding_step1", JSON.stringify(form));
    localStorage.setItem(
    "onboarding_phone",
    `${form.country_code}${form.contact_number}`
    );
    navigate("/onboarding/step2");
  };

  return (
    <div className="onboarding-root">
      <div className="onboarding-left">
        <div className="form-box">
          <h1 className="staatlich-font form-title">Let's Get Started</h1>
          <AvatarUpload image={form.profile_picture} onChange={handleAvatar} />

          <label className="form-label">Full Name</label>
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="input-outline"
              placeholder="Your name as per ID"
            />
          </div>

          <label className="form-label">Age</label>
          <div className="input-group">
            <Calendar size={18} />
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="input-outline"
              placeholder="Your age"
            />
          </div>

          <label className="form-label">Gender</label>
          <div className="input-group">
            <ChevronDown size={18} />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input-outline"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <label className="form-label">Phone Number</label>
          <div className="input-group">
            <Phone size={18} />
            <CountryCodeDropdown
              value={form.country_code}
              onChange={(code) => handlePhoneChange(code, form.contact_number)}
            />
            <input
              type="tel"
              name="contact_number"
              value={form.contact_number}
              onChange={(e) => handlePhoneChange(form.country_code, e.target.value)}
              className="input-outline"
              placeholder="9876543210"
            />
          </div>

          <button
            className="submit-btn"
            onClick={handleNext}
            disabled={!isValid}
          >
            Next
          </button>
        </div>
      </div>
      <div className="onboarding-right">
        <video
          src="/loop.mp4"
          autoPlay
          muted
          loop
          className="onboarding-video"
        />
      </div>
    </div>
  );
}
