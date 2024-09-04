// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get } from 'firebase/database';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqe5tm8RDn4gX7BiiJQLguB7HHlLlv3Kw",
    authDomain: "nftcanvas-aadfd.firebaseapp.com",
    projectId: "nftcanvas-aadfd",
    storageBucket: "nftcanvas-aadfd.appspot.com",
    messagingSenderId: "169551531106",
    appId: "1:169551531106:web:bbdebe95123a8dc185953b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, setDoc, getDocs, getDoc };

// export { database, ref, set, get };
