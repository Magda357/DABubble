import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  // Firestore korrekt injizieren (statt constructor)
  private firestore = inject(Firestore);

  // Channels Collection laden
  getChannels(): Observable<any[]> {
    const channelsRef = collection(this.firestore, 'channels');
    return collectionData(channelsRef, { idField: 'id' });
  }

  // Direct Messages Collection laden
  getDirectMessages(): Observable<any[]> {
    const dmRef = collection(this.firestore, 'directMessages');
    return collectionData(dmRef, { idField: 'id' });
  }

  // Users Collection laden
  getUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' });
  }

  // Neuen Channel erstellen
  async createChannel(channelData: any) {
    const channelsRef = collection(this.firestore, 'channels');
    return await addDoc(channelsRef, {
      ...channelData,
      createdAt: new Date(),
    });
  }
}
