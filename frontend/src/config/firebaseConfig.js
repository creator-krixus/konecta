// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgdRyxdvBsk1fJ050QcsM-_vl_1PsaE44",
  authDomain: "save-images-544a9.firebaseapp.com",
  projectId: "save-images-544a9",
  storageBucket: "save-images-544a9.appspot.com",
  messagingSenderId: "339689732811",
  appId: "1:339689732811:web:3434285dc5b59e0a83394e",
  measurementId: "G-HL3NY8N5W1"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta la referencia a Firebase Storage
const storage = getStorage(app);
export { storage };
