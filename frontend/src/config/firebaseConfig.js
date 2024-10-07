// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_APIK_KEY,
  authDomain: import.meta.env.VITE_API_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_API_PROJECTID,
  storageBucket: import.meta.env.VITE_API_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_API_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_API_APP_ID,
  measurementId: import.meta.env.VITE_API_MEASUREMENT_ID
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta la referencia a Firebase Storage
const storage = getStorage(app);
export { storage };
