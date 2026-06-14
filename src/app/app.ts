import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);

  protected readonly message = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(_ => `BONJOUR${this.router.url.length}`),
    ),
    {initialValue: `BONJOUR${this.router.url.length}`},
  );
}
