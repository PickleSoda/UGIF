// Import the functions you need from the SDKs you need
  import { initializeApp, getApps } from "firebase/app";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBwDTtgJYvCfT0oC3AHunzortPE976cND4",
    authDomain: "starswap-91cd8.firebaseapp.com",
    projectId: "starswap-91cd8",
    storageBucket: "starswap-91cd8.appspot.com",
    messagingSenderId: "929769570343",
    appId: "1:929769570343:web:93577921dabd9a6b4c0e02",
    measurementId: "G-ZEH45CHVK6"
  };
  
  
  // Initialize Firebase
  let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  export default firebase_app;