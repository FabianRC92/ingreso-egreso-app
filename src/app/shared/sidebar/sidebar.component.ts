import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombreUsuario: string;
  userSubscription: Subscription;

  constructor(private auth: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

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

  cerrarSesion() {
    this.auth.logout().then(data => this.router.navigate(['/login']))
      .catch(err => console.log(err));
  }

}
