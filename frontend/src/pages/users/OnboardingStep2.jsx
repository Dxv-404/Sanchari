// OnboardingStep2.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/users/onboarding/Onboarding.css";
import UploadBlock from "../../components/users/onboarding/UploadBlock";
import { postTempOnboarding } from "../../services/api";

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    aadhar_front: null,
    aadhar_back: null,
    license: null,
    no_license: false,
  });
  const [step1Data, setStep1Data] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("onboarding_step1");
    if (!data) navigate("/onboarding");
    else setStep1Data(JSON.parse(data));
  }, [navigate]);

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, no_license: !prev.no_license, license: null }));
  };

  const isValid =
    form.aadhar_front &&
    form.aadhar_back &&
    (form.no_license || form.license);

  const handleSubmit = async () => {
    const data = new FormData();
    const merged = { ...step1Data, ...form };

    Object.entries(merged).forEach(([k, v]) => {
      if (v instanceof File) {
        data.append(k, v);
      } else if (typeof v === "boolean") {
        data.append(k, v ? "true" : "false");
      } else if (v !== null && v !== undefined) {
        data.append(k, v);
      }
    });

    try {
      const res = await postTempOnboarding(data);
      const session_id = res.data.session_id;

      // Save session + phone for Firebase OTP screen
      localStorage.setItem("onboarding_session_id", session_id);
      localStorage.setItem("onboarding_phone", step1Data.contact_number);

      // ⛔ Removed backend OTP call: Firebase handles it in OTP page
      navigate("/onboarding/otp");

    } catch (err) {
      alert("Submission failed");
      console.error(err);
    }
  };

  return (
    <div className="onboarding-root">
      <div className="onboarding-left">
        <h1 className="section-heading">WELCOME</h1>
        <h2 className="form-title">Verify Your Documents</h2>
        <div className="form-box">
          <UploadBlock
            label="Upload Aadhar Card - Front"
            value={form.aadhar_front}
            onChange={(file) => setForm({ ...form, aadhar_front: file })}
          />

          <UploadBlock
            label="Upload Aadhar Card - Back"
            value={form.aadhar_back}
            onChange={(file) => setForm({ ...form, aadhar_back: file })}
          />

          <div className="form-toggle-row">
            <input
              type="checkbox"
              id="no_license"
              checked={form.no_license}
              onChange={handleToggle}
            />
            <label htmlFor="no_license">I don't have a license</label>
          </div>

          <UploadBlock
            label="Upload Driver's License"
            value={form.license}
            onChange={(file) => setForm({ ...form, license: file })}
            disabled={form.no_license}
          />

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Continue to OTP
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
