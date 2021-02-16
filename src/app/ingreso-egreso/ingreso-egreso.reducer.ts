import { createReducer, on } from '@ngrx/store';
import { IngresoEgreso } from '../model/ingreso-egreso.model';
import * as actions from './ingreso-egreso.actions';
import { AppState } from '../app.reducer';


export interface State {
    items: IngresoEgreso[]
};


export interface AppStateIngreso extends AppState {
    ingresosEgresos: State
}

const initialState: State = {
    items: []
};

export const _ingresoEgresoReducer = createReducer(
    initialState,
    on(
        actions.setItems,
        (state, { items }) => ({ ...state, items: [...items] }),
    ), on(
        actions.unsetItems,
        (state) => ({ ...state, items: [] }),
    ),
);

export function ingresoEgresoReducer(state, action) {
    return _ingresoEgresoReducer(state, action)
}
