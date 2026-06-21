import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface GridItem {
  id: number;
  label: string;
}

@Component({
  selector: 'app-app-component',
  imports: [],
  templateUrl: './app-component.html',
  styleUrl: './app-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // :host[data-theme="dark"] — binding sur l'élément hôte pour illustrer :host avec attribut
    '[attr.data-theme]': 'isDarkTheme() ? "dark" : null',
    // :host-context — on ajoute/retire la classe .dark-theme sur l'hôte pour simuler un ancêtre thémé
    '[class.dark-theme]': 'isDarkTheme()',
  },
})
export class AppComponent {
  readonly router = inject(Router);

  // Signal pour le thème — illustre :host[data-theme] et :host-context(.dark-theme)
  readonly isDarkTheme = signal(false);

  // Données pour la démonstration @media (grille responsive)
  readonly gridItems = computed<GridItem[]>(() => [
    { id: 1, label: 'mobile' },
    { id: 2, label: 'sm: 2 col' },
    { id: 3, label: 'md: 3 col' },
    { id: 4, label: 'lg: 6 col' },
    { id: 5, label: 'responsive' },
    { id: 6, label: '@media' },
  ]);

  toggleTheme(): void {
    this.isDarkTheme.update(v => !v);
  }

  redirectToPocTest(): void {
    this.router.navigate(['/formModulesPoc/test']);
  }

  redirectToPocSignalsTest(): void {
    this.router.navigate(['/formModulesPocSignals/123/test/123']);
  }

  redirectToFlexboxDemo(): void {
    this.router.navigate(['/flexbox-demo']);
  }
}
