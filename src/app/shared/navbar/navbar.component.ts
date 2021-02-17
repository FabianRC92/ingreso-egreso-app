import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {


  nombreUsuario: string;
  userSubscription: Subscription;

  constructor(private store: Store<AppState>) { }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
      .pipe(
        filter(({user}) => user != null)
      )
      .subscribe(({ user }) => this.nombreUsuario = user.nombre);
  }

}
