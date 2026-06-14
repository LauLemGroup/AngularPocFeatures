import {Routes} from '@angular/router';
import {FormModulesPocSignals} from "./form-modules-poc-signals";

export const routes: Routes = [
    {
        path: 'test/:numberOfTest',
        component: FormModulesPocSignals
    },
    {
        path: 'test',
        component: FormModulesPocSignals
    },
];
