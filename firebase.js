import {
initializeApp
}
from
"https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";


import {
getFirestore,
collection,
addDoc
}
from
"https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";



const firebaseConfig = {


apiKey:
"AIzaSyCPSWkc7VfhhEROFY_EdPyP56kS66tTQZ4",


authDomain:
"kyudai-cat-map.firebaseapp.com",


projectId:
"kyudai-cat-map",


storageBucket:
"kyudai-cat-map.firebasestorage.app",


messagingSenderId:
"164561348047",


appId:
"1:164561348047:web:e3733a0ea44a3e37339eba"


};




const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);



export {
db,
collection,
addDoc
};
