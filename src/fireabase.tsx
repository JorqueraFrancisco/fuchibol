import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAFDol4whOfqMl0Mxph2E9r0oU4Oo43L00",
    authDomain: "fuchibol-3cda9.firebaseapp.com",
    projectId: "fuchibol-3cda9",
    storageBucket: "fuchibol-3cda9.appspot.com",
    messagingSenderId: "748500205318",
    appId: "1:748500205318:web:47d31849553e35f0ce6887",
    measurementId: "G-QFX7N34P4P"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);



// Prod

// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }