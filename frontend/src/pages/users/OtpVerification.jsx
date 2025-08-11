import React, { useRef, useState, useEffect } from "react";
import "../../components/users/onboarding/Onboarding.css";
import "../../components/users/onboarding/OTPVerification.css";
import { useNavigate } from "react-router-dom";
import { finalizeUser } from "../../services/api";
import axios from "axios";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const session_id = localStorage.getItem("onboarding_session_id");
  const phone = localStorage.getItem("onboarding_phone");
  const country_code = localStorage.getItem("onboarding_country_code") || "+91";
  const fullPhone = `${country_code}${phone}`;

  useEffect(() => {
    const sendInitialOtp = async () => {
      try {
        await axios.post("http://127.0.0.1:8000/api/otp/send/", {
          phone: fullPhone,
        });
        console.log("✅ OTP sent to", fullPhone);
      } catch (err) {
        console.error("❌ OTP send failed:", err);
        setError("Failed to send OTP. Try again later.");
      }
    };

    sendInitialOtp();
  }, [fullPhone]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleChange = (e, idx) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) inputsRef.current[idx + 1].focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const split = pasted.split("");
      setOtp(split);
      inputsRef.current[5].focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the full OTP.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/otp/verify/", {
        phone: fullPhone,
        otp: fullOtp,
      });

      if (res.data.type === "success" || res.data.message === "OTP verified success") {
        await finalizeUser(session_id);
        navigate("/onboarding/sanchari");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("❌ OTP verification failed:", err);
      setError("Invalid OTP or server error.");
    }
  };

  const handleResend = async () => {
    try {
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setResendEnabled(false);
      setError(null);

      await axios.post("http://127.0.0.1:8000/api/otp/send/", {
        phone: fullPhone,
      });

      console.log("🔁 OTP resent");
    } catch (err) {
      console.error("❌ Resend failed:", err);
      setError("Failed to resend OTP.");
    }
  };

  return (
    <div className="otp-page">
      <video className="otp-video" autoPlay muted loop>
        <source src="/assets/otp-video.mp4" type="video/mp4" />
      </video>

      <div className="otp-overlay">
        <div className="otp-box">
          <img src="/assets/otp-gif.gif" alt="verify" className="otp-gif" />
          <h2 className="staatlich-font otp-title">Enter the code we sent you</h2>
          <p className="otp-subtext">We sent it to {country_code} {phone}</p>

          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="otp-digit"
              />
            ))}
          </div>

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            {resendEnabled ? (
              <button className="otp-resend" onClick={handleResend}>
                Resend OTP
              </button>
            ) : (
              <p className="otp-timer">
                Resend OTP in 00:{timer.toString().padStart(2, "0")}
              </p>
            )}
          </div>

          <button className="submit-btn" onClick={handleVerify}>
            VERIFY
          </button>
        </div>
      </div>
    </div>
  );
}
