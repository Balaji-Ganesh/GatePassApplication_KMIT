const firebase = require("firebase");
require("dotenv").config();
const firebaseConfig = {
  // ------ used for the testing..
  // apiKey: "AIzaSyBIDUGA_aL0Xe48g4-AJLEPFd6dy9I5b2k",
  // authDomain: "rakshak-simulator.firebaseapp.com",
  // projectId: "rakshak-simulator",
  // storageBucket: "rakshak-simulator.appspot.com",
  // messagingSenderId: "309754976933",
  // appId: "1:309754976933:web:48cdbf65eb2cd4ff9f0b4c",

  // --- actual real-time database..
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = db;
