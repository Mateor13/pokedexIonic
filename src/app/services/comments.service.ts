import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private firestore: Firestore) { }

  async saveComment(pokemonName: string, comment: string) {
    const commentsRef = collection(this.firestore, 'pokemonComments');
    await addDoc(commentsRef, {
      pokemonName,
      comment,
      createdAt: new Date()
    });
  }

  async getCommentsByPokemon(pokemonName: string): Promise<{ comment: string, createdAt: Date }[]> {
    const commentsRef = collection(this.firestore, 'pokemonComments');
    const q = query(commentsRef, where('pokemonName', '==', pokemonName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt: Date;
      if (data['createdAt'] && typeof data['createdAt'].toDate === 'function') {
        createdAt = data['createdAt'].toDate();
      } else {
        createdAt = new Date(data['createdAt']);
      }
      return {
        comment: data['comment'],
        createdAt
      };
    });
  }
}