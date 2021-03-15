import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './config/firebase';

firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV !== 'production' && false) {
  firebase.functions().useFunctionsEmulator('http://localhost:5001');
}

export const db = firebase.firestore();
export default firebase;
