import firebase from 'firebase'
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyA5ZoLAgn18xhdIouag6o0z4b4cEcFbuaE",
    authDomain: "wireleibrary-dc892.firebaseapp.com",
    databaseURL: "https://wireleibrary-dc892-default-rtdb.firebaseio.com",
    projectId: "wireleibrary-dc892",
    storageBucket: "wireleibrary-dc892.appspot.com",
    messagingSenderId: "635949942035",
    appId: "1:635949942035:web:f99fcf0122cce6bbad46e6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();