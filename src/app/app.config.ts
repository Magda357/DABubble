import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-8a38d',
        appId: '1:419236489449:web:e24fa2ca6d8a8b52fea878',
        storageBucket: 'dabubble-8a38d.firebasestorage.app',
        apiKey: 'AIzaSyCLraiOxkGYlCnsFdmXoEb9-BdWfCw9mUQ',
        authDomain: 'dabubble-8a38d.firebaseapp.com',
        messagingSenderId: '419236489449',
        measurementId: 'G-0RKK0ZSFXG',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
