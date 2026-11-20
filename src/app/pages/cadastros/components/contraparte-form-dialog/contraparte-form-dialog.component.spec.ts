import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { TipoContraparte } from '../../enums/tipo-contraparte.enum';
import { ContraparteFormDialogComponent } from './contraparte-form-dialog.component';

describe('ContraparteFormDialogComponent', () => {
  let fixture: ComponentFixture<ContraparteFormDialogComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContraparteFormDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).overrideTemplate(ContraparteFormDialogComponent, '');
    fixture = TestBed.createComponent(ContraparteFormDialogComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('aceita contraparte sem CPF/CNPJ, como o backend', () => {
    const c = fixture.componentInstance;
    c.form.patchValue({ legalName: 'Fornecedor Sem Documento', taxId: '', counterpartyType: TipoContraparte.OTHER });
    c.salvar();

    const req = http.expectOne('/api/v1/counterparties');
    expect(req.request.body.taxId).toBeUndefined();
    req.flush({});
  });

  it('envia o documento só com dígitos', () => {
    const c = fixture.componentInstance;
    c.form.patchValue({ legalName: 'Fornecedor X', taxId: '12.345.678/0001-95', counterpartyType: TipoContraparte.SUPPLIER });
    c.salvar();

    const req = http.expectOne('/api/v1/counterparties');
    expect(req.request.body.taxId).toBe('12345678000195');
    req.flush({});
  });

  it('continua recusando documento com dígito verificador errado', () => {
    const c = fixture.componentInstance;
    c.form.patchValue({ legalName: 'Fornecedor X', taxId: '111.111.111-11' });

    expect(c.form.controls.taxId.hasError('cpfCnpj')).toBe(true);
  });
});
