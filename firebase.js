import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyBPZ1goaXwUxNATdTZ2vbsWYmfO2AGZ93A",

  authDomain: "complaint-system-7d7f0.firebaseapp.com",

  projectId: "complaint-system-7d7f0"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 
