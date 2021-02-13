import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../model/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fUser => {

      if (fUser) {

        this.userSubscription = this.firestore.doc(`${fUser.uid}/usuario`).valueChanges()
          .subscribe((user: any) => {

            const usuario: Usuario = {
              uid: user.uid,
              nombre: user.nombre,
              email: user.email
            };

            this.store.dispatch(actions.setUser({ user: usuario }))

          });
      } else {
        if (this.userSubscription) this.userSubscription.unsubscribe();
        this.store.dispatch(actions.unsetUser());
      }

    });
  }

  crearUsuario(nombre: string, correo: string, password: string) {

    return this.auth.createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {

        const newUser: Usuario = {

          uid: user.uid,
          nombre: nombre,
          email: user.email

        };

        return this.firestore.doc(`${user.uid}/usuario`)
          .set(newUser);

      });

  }

  loginUsuario(correo: string, password: string) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logout() {
    return this.auth.signOut();
  }


  isAuth() {
    return this.auth.authState.pipe(
      map(fuser => fuser != null)
    );
  }

}
