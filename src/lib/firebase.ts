import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// You can find this in Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyA4tiV6zJjozoxASYI6npTfhglMKXKlP9I",
    authDomain: "chorsu-779f5.firebaseapp.com",
    projectId: "chorsu-779f5",
    storageBucket: "chorsu-779f5.firebasestorage.app",
    messagingSenderId: "575117196774",
    appId: "1:575117196774:web:5c452bb0c7ca8bbc242a27",
    measurementId: "G-8WXFPZ2M8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
