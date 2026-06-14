import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-app-component',
  imports: [],
  templateUrl: './app-component.html',
  styleUrl: './app-component.scss',
})
export class AppComponent {
  readonly router = inject(Router);
  redirectToPocTest() {
    this.router.navigate(['/formModulesPoc/test']);
  }

  redirectToPocSignalsTest() {
    this.router.navigate(['/formModulesPocSignals/123/test/123']);
  }
}
