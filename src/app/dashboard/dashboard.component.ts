import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as actions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {


  userSubscription: Subscription;
  ingresosSubs: Subscription;

  constructor(private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService) { }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ingresosSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      ).subscribe(({ user }) => {
        this.ingresosSubs = this.ingresoEgresoService.consutlarIngresoEgresoListener(user.uid)
          .subscribe(ingresoEgreso => this.store.dispatch(actions.setItems({ items: ingresoEgreso })));
      });
  }

}
