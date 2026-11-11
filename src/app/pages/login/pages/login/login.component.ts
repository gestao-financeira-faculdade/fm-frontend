import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { mensagemErro } from '../../../../utils/problem-detail.util';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Query param preenchido pelo authGuard (bindToComponentInputs). */
  readonly returnUrl = input<string>();

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.carregando.set(true);
    this.erro.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigateByUrl(this.returnUrl() || '/'),
      error: (e: HttpErrorResponse) => {
        this.carregando.set(false);
        this.erro.set(e.status === 401 ? 'E-mail ou senha incorretos, ou usuário inativo.' : mensagemErro(e));
      },
    });
  }
}
