import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUh25FQ7CzwHVNled2QF3MZfPFImGgk-Y",
  authDomain: "hivtreatment-a7ab9.firebaseapp.com",
  projectId: "hivtreatment-a7ab9",
  storageBucket: "hivtreatment-a7ab9.appspot.com", // ĐÃ CHỈNH ĐÚNG
  messagingSenderId: "1038700512945",
  appId: "1:1038700512945:web:7a1bd95f51048b28bd8490",
  measurementId: "G-LZ8DGEPVSQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };