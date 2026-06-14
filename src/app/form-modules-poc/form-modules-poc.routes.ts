import { Routes } from '@angular/router';
import {AppComponent} from "../app-component/app-component";
import {FormModulesPoc} from "./form-modules-poc";

export const routes: Routes = [
    {
        path: 'test',
        component: FormModulesPoc
    },
];
