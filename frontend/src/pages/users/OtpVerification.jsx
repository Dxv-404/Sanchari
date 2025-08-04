import React, { useRef, useState, useEffect } from "react";
import "../../components/users/onboarding/Onboarding.css";
import "../../components/users/onboarding/OTPVerification.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { finalizeUser } from "../../services/api";

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
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
        size: "invisible"
      }, auth);
    }

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, fullPhone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("✅ OTP sent via Firebase");
      })
      .catch((err) => {
        console.error("❌ Firebase OTP send failed:", err);
        setError("Failed to send OTP. Please try again.");
      });
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
      const result = await window.confirmationResult.confirm(fullOtp);
      console.log("✅ Verified:", result.user.phoneNumber);

      await finalizeUser(session_id);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Invalid OTP or finalize failed:", err);
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setResendEnabled(false);
    setError(null);

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      console.log("🔁 Resent OTP via Firebase");
    } catch (err) {
      console.error("Resend OTP failed:", err);
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

      <div id="recaptcha-container" />
    </div>
  );
}
