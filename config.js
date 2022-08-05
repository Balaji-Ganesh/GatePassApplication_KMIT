const firebase = require("firebase");
const firebaseConfig = {
  // ------ used for the testing..
  // apiKey: "AIzaSyBIDUGA_aL0Xe48g4-AJLEPFd6dy9I5b2k",
  // authDomain: "rakshak-simulator.firebaseapp.com",
  // projectId: "rakshak-simulator",
  // storageBucket: "rakshak-simulator.appspot.com",
  // messagingSenderId: "309754976933",
  // appId: "1:309754976933:web:48cdbf65eb2cd4ff9f0b4c",

  // --- actual real-time database..
  apiKey: "AIzaSyDMvoq-_USWQbmAhFzfePivOTlTqHQvBdg",
  authDomain: "gatepass-b7114.firebaseapp.com",
  projectId: "gatepass-b7114",
  storageBucket: "gatepass-b7114.appspot.com",
  messagingSenderId: "380433476859",
  appId: "1:380433476859:web:9727a555ef85d51ef1d45e",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = db;
