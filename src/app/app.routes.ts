import {Routes} from '@angular/router';
import {AppComponent} from "./app-component/app-component";
import {oauthGuard} from "./oauth-guard";

export const routes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'formModulesPoc',
        loadChildren: () => import('./form-modules-poc/form-modules-poc.routes').then(m => m.routes)
    },
    {
        path: 'formModulesPocSignals/:numberFirst',
        loadChildren: () => import('./form-modules-poc-signals/form-modules-poc-signals.routes').then(m => m.routes),
        data: {role: 'ADMIN'},
        canActivate: [oauthGuard],
    },

];
