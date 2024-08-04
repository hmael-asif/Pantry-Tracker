// app/firestore.js

import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "D:\general parhai\headstarter ai\project\pantry\firebase.js";  // Adjust the import path as needed

export const firestore = getFirestore(firebaseApp);
