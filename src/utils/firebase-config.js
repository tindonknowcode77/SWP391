// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // THÊM để dùng upload ảnh

// ⚠️ Sửa lại storageBucket cho đúng cú pháp!
const firebaseConfig = {
  apiKey: "AIzaSyDUh25FQ7CzwHVNled2QF3MZfPFImGgk-Y",
  authDomain: "hivtreatment-a7ab9.firebaseapp.com",
  projectId: "hivtreatment-a7ab9",
  storageBucket: "hivtreatment-a7ab9.appspot.com", 
  messagingSenderId: "1038700512945",
  appId: "1:1038700512945:web:7a1bd95f51048b28bd8490",
  measurementId: "G-LZ8DGEPVSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // ✅ cần cho upload ảnh

export { app, analytics, storage };