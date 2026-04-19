import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyBPZ1goaXwUxNATdTZ2vbsWYmfO2AGZ93A",
  authDomain: "complaint-system-7d7f0.firebaseapp.com",
  projectId: "complaint-system-7d7f0",
  storageBucket: "complaint-system-7d7f0.firebasestorage.app",
  messagingSenderId: "134478835602",
  appId: "1:134478835602:web:31dac657fd1c2e09d89b4b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
