import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

  const firebaseConfig = {
  apiKey: "AIzaSyCLraiOxkGYlCnsFdmXoEb9-BdWfCw9mUQ",
  authDomain: "dabubble-8a38d.firebaseapp.com",
  projectId: "dabubble-8a38d",
  storageBucket: "dabubble-8a38d.firebasestorage.app",
  messagingSenderId: "419236489449",
  appId: "1:419236489449:web:e24fa2ca6d8a8b52fea878",
  measurementId: "G-0RKK0ZSFXG"
};

const firebaseApp = initializeApp(firebaseConfig);

if (typeof window !== 'undefined') {
  try {
    getAnalytics(firebaseApp);
  } catch (e) {
    console.warn('Analytics nicht initialisiert:', e);
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));