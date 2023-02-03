import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase, ref, child, onValue, set, get, push, update, remove,
  query, orderByChild, limitToLast, limitToFirst, startAfter, endBefore, endAt,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

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
let reference = 'Manga4Up/', list = 'List/';

export {
  database, ref, child, onValue, set, get, push, update, remove,
  query, orderByChild, limitToLast, limitToFirst, startAfter, endBefore, endAt,
  reference, list
}