import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJRtQBoW5q3sTuUnk6r-DXfU-fZalP-Kg",
  authDomain: "sanchari-b6684.firebaseapp.com",
  projectId: "sanchari-b6684",
  storageBucket: "sanchari-b6684.appspot.com",
  messagingSenderId: "29845478246",
  appId: "1:29845478246:web:9571ae05a62fc37d0106a7",
  measurementId: "G-642RPKN7RD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
