import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDn97tEmB5J2ji9YeKTqPWTc0lsUdQsv4Q",
    authDomain: "venda-salgados.firebaseapp.com",
    projectId: "venda-salgados",
    storageBucket: "venda-salgados.firebasestorage.app",
    messagingSenderId: "699068358354",
    appId: "1:699068358354:web:d4d37a068afe79b4af170b",
    measurementId: "G-9XG4LDY20Q"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };