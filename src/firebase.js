import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
 

//   apiKey: "Your api key her",
//   authDomain: "somethin firebaseapp.com",
//   databaseURL: "https://project0name-7ae4a.firebaseio.com",
//   projectId: "proejct ID ",
//   storageBucket: "Store bucket",
//   messagingSenderId: "message sender id ",
//   appId: "Your api key goes her"
});

export { firebaseConfig as firebase };
