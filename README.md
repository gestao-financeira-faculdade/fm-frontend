# Gestão Financeira — PWA

Front-end Angular 18 + PrimeNG 18 para a API descrita em [API_ENDPOINTS.md](API_ENDPOINTS.md):
lançamentos a pagar/receber, liquidação total e parcial (split), comprovantes fiscais,
cadastros de referência, simulação de Monte Carlo, dashboard com cone de incerteza,
exportação de relatórios e trilha de auditoria.

## Como rodar

```bash
npm install
npm start            # http://localhost:4200 — /api é encaminhado para http://localhost:8080 (proxy.conf.json)
```

| Comando              | Ambiente (`src/environments/`) |
| -------------------- | ------------------------------ |
| `npm start`          | `environment.dev.ts`           |
| `npm run build:qa`   | `environment.qa.ts`            |
| `npm run build:hm`   | `environment.hm.ts`            |
| `npm run build:prod` | `environment.prod.ts`          |

O service worker (PWA) só é registrado em builds de produção (`qa`, `hm`, `prod`).

## Estrutura

```
src/app/
├── app.module.ts / app-routing.module.ts   raiz: interceptors, locale pt-BR, tema PrimeNG, SW; rotas /login e '' (lazy)
├── primeng-preset.ts / theme/colors.ts     tema "Aura" com a paleta da marca (espelha tailwind.config.js)
├── pages/                                  FEATURES — uma pasta por domínio de negócio
│   ├── index.module.ts                     shell autenticado + rotas filhas (lazy)
│   ├── login/  minha-conta/
│   ├── dashboard/  lancamentos/  cadastros/  simulacoes/  relatorios/  auditoria/
│   │   └── <feature>/
│   │       ├── components/  pages/  services/  interfaces/  enums/  constants/  validators/
│   │       ├── <feature>-permissoes.ts     matriz de roles da feature
│   │       └── <feature>.module.ts / <feature>-routing.module.ts
├── layouts/        main-layout (sidebar + topbar + router-outlet)
├── components/     nav-sidebar, topbar
├── shared/         share.module.ts + page-header, filter-card, empty-state, cone-incerteza-chart, estado-diff
├── services/       auth, token-storage, pwa-update          (só o que é transversal)
├── interceptors/   AuthInterceptor (JWT + fila de refresh), ErrorInterceptor (ProblemDetail → toast)
├── guards/         authGuard, guestGuard, permissaoGuard (funcionais)
├── directives/     *appPermissao
├── pipes/          moeda, cpfCnpj, tamanhoArquivo
├── interfaces/ enums/ utils/ constants/
```

Regra: em `app/` fica só o que é transversal (auth, layout, UI compartilhada). Todo o resto vive
dentro da pasta da feature, no modelo do módulo `avelloz-veiculos`.

## Convenções

- Nomes de arquivo do Angular CLI (`thing.component.ts|html`, `thing.service.ts`); cada componente na sua pasta.
- Vocabulário de domínio em português (`lancamento`, `liquidacao`, `contraparte`); termos do Angular em inglês.
- Componentes declarados em NgModules usam `standalone: false` explicitamente.
- UI com PrimeNG (componentes + primeicons); layout com Tailwind. Ordem de camadas CSS:
  `tailwind-base < primeng < tailwind-utilities`.
- Permissões: use `*appPermissao="PERMISSOES.acao"` na UI e `permissaoGuard` + `data.roles` nas rotas.
  Esconder na UI é conveniência; quem garante é o backend (403).

## Comportamentos importantes

- **Sessão:** access token + refresh token no `localStorage`. Em 401, o `AuthInterceptor` faz **um único**
  refresh e reenfileira as requisições concorrentes; se o refresh falhar, a sessão é encerrada.
- **Erros:** respostas `application/problem+json` viram toast. Para tratar um erro na própria tela,
  passe `context: semToastDeErro()` na chamada HTTP (ex.: liquidação, simulação, `/simulations/latest`).
- **Criação de lançamento:** envia `Idempotency-Key`; a chave é mantida em retentativas e renovada
  quando o formulário muda.
- **Liquidação:** usa `version` do lançamento como `expectedVersion`; 409 oferece recarregar,
  422 `MISSING_FISCAL_ATTACHMENT` leva à aba de anexos.

## Pontos a confirmar com o backend

O contrato não detalha todos os DTOs. Os campos abaixo foram inferidos e estão centralizados nas
interfaces/utilitários indicados — ajuste lá se o backend divergir:

| Item | Onde ajustar |
| ---- | ------------ |
| `PagedResult` (`items`/`totalElements`; aceita também `content`) | `interfaces/paged-result.interface.ts` |
| Campos de `FinancialEntryResponse` além do request (`outstandingAmount`, `version`, `*Name`, `parentEntryId`) | `pages/lancamentos/interfaces/lancamento.interface.ts` |
| `SettlementResponse.residualEntryId`, `FinancialEntryLineageNode` | `pages/lancamentos/interfaces/` |
| `FiscalAttachmentResponse` (`fileName`, `sizeBytes`, `uploadedAt`) | `pages/lancamentos/interfaces/anexo.interface.ts` |
| Itens de `dailyBands`, `historicalSeries`, `projectionCone` | `utils/cone.util.ts` |
| `AuditLogItemResponse` (`occurredAt`, `actorName`) | `pages/auditoria/interfaces/auditoria.interface.ts` |
| Propriedade do código de erro no ProblemDetail (`code`/`errorCode`) | `utils/problem-detail.util.ts` |
| Demais valores de `accountType`, `counterpartyType` (`CUSTOMER` inferido) e `entityType` | `pages/cadastros/enums/`, `pages/auditoria/enums/` |

Em chamadas cross-origin, o backend precisa expor `Content-Disposition`
(`Access-Control-Expose-Headers`) para os downloads manterem o nome do arquivo.
