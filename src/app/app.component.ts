import { Component, inject, OnInit } from '@angular/core';

import { PwaUpdateService } from './services/pwa-update.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly pwaUpdate = inject(PwaUpdateService);

  ngOnInit(): void {
    this.pwaUpdate.iniciar();
  }
}
