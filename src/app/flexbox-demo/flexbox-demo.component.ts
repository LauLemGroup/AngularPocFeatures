import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-flexbox-demo',
  standalone: true,
  templateUrl: './flexbox-demo.component.html',
  styleUrls: ['./flexbox-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexboxDemoComponent {}
