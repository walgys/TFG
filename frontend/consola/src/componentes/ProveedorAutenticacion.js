import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCZldwUUxUTP2pQnbolhbHBufqEfbDfKzQ',
  authDomain: 'tfg-infra-data.firebaseapp.com',
  projectId: 'tfg-infra-data',
  storageBucket: 'tfg-infra-data.appspot.com',
  messagingSenderId: '225000785399',
  appId: '1:225000785399:web:3323f30f83ee36dc469af2',
  measurementId: 'G-Z00C9699ZM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const ProveedorAutenticacion = {
  signin(email, password, callback) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return callback({ validated: true, userCredential });
      })
      .catch((error) => {
        return callback({ validated: false, error: error });
      });
  },
  signout(callback) {
    ProveedorAutenticacion.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export default ProveedorAutenticacion;
