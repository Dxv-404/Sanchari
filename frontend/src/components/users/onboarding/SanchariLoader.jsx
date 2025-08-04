// src/pages/users/SanchariLoader.jsx
import React, { useEffect, useState } from "react";
import "./SanchariLoader.css";

const langs = [
  "संचारी",     // Hindi
  "সঞ্চারী",     // Bengali
  "સંચારી",     // Gujarati
  "സഞ്ചാരി",     // Malayalam
  "సంచారి",     // Telugu
  "சஞ்சாரி",     // Tamil
  "ಸಂಚಾರಿ"      // Kannada
];

export default function SanchariLoader() {
  const [currentLang, setCurrentLang] = useState(langs[0]);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % langs.length;
      setCurrentLang(langs[i]);
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setShowTitle(true);
    }, 500 * langs.length + 1000); // 3.5s + 1s delay

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="sanchari-loader-page">
      {!showTitle ? (
        <div className="intro-text">{currentLang}</div>
      ) : (
        <h1 className="title">संचारी</h1>
      )}
    </div>
  );
}
