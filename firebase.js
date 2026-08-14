import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAjEzipgNfXyOGa97XdfX0KAYEa2pxdXrQ",
    authDomain: "bunkasai-sales.firebaseapp.com",
    projectId: "bunkasai-sales",
    storageBucket: "bunkasai-sales.firebasestorage.app",
    messagingSenderId: "518348218611",
    appId: "1:518348218611:web:8d0b29b153f92b61eb5786"
  };


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(
    app,
    "https://bunkasai-sales-default-rtdb.asia-southeast1.firebasedatabase.app"
);

export {
    db,
    auth,
    signInAnonymously
};