import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../model/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import { unsetItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return { ... this._user };
  }

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
            this._user = usuario;
            this.store.dispatch(actions.setUser({ user: usuario }))

          });
      } else {
        if (this.userSubscription) this.userSubscription.unsubscribe();
        this._user = null;
        this.store.dispatch(actions.unsetUser());
        this.store.dispatch(unsetItems())
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
