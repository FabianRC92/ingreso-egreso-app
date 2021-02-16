import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../model/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {

    return this.firestore.doc(`${this.authService.user.uid}/ingresos-egresos/`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  consutlarIngresoEgresoListener(uid: string) {

    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc => ({

          uid: doc.payload.doc.id,
          ...doc.payload.doc.data() as any

        })))
      );

  }


  borrarItems(uidItem: string) {

    const uid = this.authService.user.uid;

    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`)
      .delete();
      
  }

}
