import { Role } from '../enums/role.enum';
import { AUDITORIA_PERMISSOES } from '../pages/auditoria/auditoria-permissoes';

export interface ItemMenu {
  label: string;
  icone: string;
  rota: string;
  roles?: readonly Role[];
}

export interface GrupoMenu {
  titulo?: string;
  itens: ItemMenu[];
}

export const MENU_PRINCIPAL: GrupoMenu[] = [
  {
    itens: [
      { label: 'Dashboard', icone: 'pi pi-chart-line', rota: '/dashboard' },
      { label: 'Lançamentos', icone: 'pi pi-wallet', rota: '/lancamentos' },
      { label: 'Simulações de risco', icone: 'pi pi-chart-scatter', rota: '/simulacoes' },
      { label: 'Relatórios', icone: 'pi pi-file-export', rota: '/relatorios' },
    ],
  },
  {
    titulo: 'Cadastros',
    itens: [
      { label: 'Contas financeiras', icone: 'pi pi-building-columns', rota: '/cadastros/contas' },
      { label: 'Categorias', icone: 'pi pi-tags', rota: '/cadastros/categorias' },
      { label: 'Contrapartes', icone: 'pi pi-users', rota: '/cadastros/contrapartes' },
    ],
  },
  {
    titulo: 'Governança',
    itens: [
      {
        label: 'Auditoria',
        icone: 'pi pi-history',
        rota: '/auditoria',
        roles: AUDITORIA_PERMISSOES.visualizar,
      },
    ],
  },
];
