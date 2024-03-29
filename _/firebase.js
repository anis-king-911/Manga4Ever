import {
  initializeApp
} from "firebase-app";
import {
  getDatabase, ref, child, onValue, get,
  query, orderByChild, startAfter, endAt,
  set, push, update, remove,
} from "firebase-data";

const firebaseConfig = {
  apiKey: "AIzaSyDxJdw2Or76OzVUaAaGSIQ036veT7AlZ00",
  authDomain: "manga4ever-vercel.firebaseapp.com",
  databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "manga4ever-vercel",
  storageBucket: "manga4ever-vercel.appspot.com",
  messagingSenderId: "816513080903",
  appId: "1:816513080903:web:750f10d34d80558ce71b62"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let MainList = 'MainList/', CoversList = 'CoversList/';
let order = 'ID', size = 6;

export {
  MainList, CoversList, order, size,
  database, ref, child, onValue, get,
  query, orderByChild, startAfter, endAt,
  set, push, update, remove,
}