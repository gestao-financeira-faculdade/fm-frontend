import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';

/** Avisa quando uma nova versão do PWA foi baixada pelo service worker. */
@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly messageService = inject(MessageService);

  iniciar(): void {
    if (!this.swUpdate.isEnabled) return;
    this.swUpdate.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() =>
        this.messageService.add({
          key: 'pwa',
          severity: 'info',
          summary: 'Nova versão disponível',
          detail: 'Recarregue a página para atualizar.',
          sticky: true,
        }),
      );
  }

  recarregar(): void {
    document.location.reload();
  }
}
