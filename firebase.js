// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7ZpY6jiXz32htwgGjfI3l6kTW3IN9Tgw",
  authDomain: "inventory-management-d43d0.firebaseapp.com",
  projectId: "inventory-management-d43d0",
  storageBucket: "inventory-management-d43d0.appspot.com",
  messagingSenderId: "554403538000",
  appId: "1:554403538000:web:0ad10badf485598746dd55",
  measurementId: "G-VJLKV297G2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}