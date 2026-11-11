import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';

import { PermissaoDirective } from '../directives/permissao.directive';
import { CpfCnpjPipe } from '../pipes/cpf-cnpj.pipe';
import { MoedaPipe } from '../pipes/moeda.pipe';
import { TamanhoArquivoPipe } from '../pipes/tamanho-arquivo.pipe';
import { ConeIncertezaChartComponent } from './components/cone-incerteza-chart/cone-incerteza-chart.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { EstadoDiffComponent } from './components/estado-diff/estado-diff.component';
import { FilterCardComponent } from './components/filter-card/filter-card.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';

const ANGULAR = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const PRIMENG = [
  AvatarModule,
  ButtonModule,
  CardModule,
  ChartModule,
  CheckboxModule,
  DatePickerModule,
  DialogModule,
  DividerModule,
  FileUploadModule,
  IconFieldModule,
  InputIconModule,
  InputNumberModule,
  InputTextModule,
  MenuModule,
  MessageModule,
  PasswordModule,
  ProgressBarModule,
  ProgressSpinnerModule,
  SelectButtonModule,
  SelectModule,
  SkeletonModule,
  TableModule,
  TabsModule,
  TagModule,
  TextareaModule,
  TimelineModule,
  ToggleSwitchModule,
  TooltipModule,
  TreeTableModule,
];

const DECLARACOES = [
  PageHeaderComponent,
  FilterCardComponent,
  EmptyStateComponent,
  ConeIncertezaChartComponent,
  EstadoDiffComponent,
  PermissaoDirective,
  MoedaPipe,
  CpfCnpjPipe,
  TamanhoArquivoPipe,
];

/** Módulo compartilhado: importe em todo módulo de feature. */
@NgModule({
  declarations: DECLARACOES,
  imports: [...ANGULAR, ...PRIMENG],
  exports: [...ANGULAR, ...PRIMENG, ...DECLARACOES],
})
export class SharedModule {}
