import { ComponentFixture, TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { RelatoriosComponent } from './relatorios.component';
import { RentalApiService, AlugueisResponse } from '../../shared/services/rental-api.service';

registerLocaleData(localePt, 'pt-BR');

describe('RelatoriosComponent', () => {
  let component: RelatoriosComponent;
  let fixture: ComponentFixture<RelatoriosComponent>;
  let mockRentalApi: jasmine.SpyObj<RentalApiService>;

  const mockResponse: AlugueisResponse = {
    alugueis: [
      {
        dataAluguel: '02/01/2024',
        modeloCarro: 'POLO',
        kmCarro: 225426,
        nomeCliente: 'Lucas',
        telefoneCliente: '+55(65)99184-2240',
        dataDevolucao: '05/01/2024',
        valor: 675,
        pago: 'NAO',
      },
      {
        dataAluguel: '10/01/2024',
        modeloCarro: 'GOL',
        kmCarro: 154748,
        nomeCliente: 'Carlos',
        telefoneCliente: '+55(44)99222-0053',
        dataDevolucao: '12/01/2024',
        valor: 370,
        pago: 'SIM',
      },
    ],
    valorTotalNaoPago: 675,
  };

  beforeEach(async () => {
    mockRentalApi = jasmine.createSpyObj('RentalApiService', ['getAlugueis']);
    mockRentalApi.getAlugueis.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [RelatoriosComponent],
      providers: [
        MessageService,
        { provide: RentalApiService, useValue: mockRentalApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load alugueis on init', () => {
    expect(component.alugueis.length).toBe(2);
    expect(component.valorTotalNaoPago).toBe(675);
  });

  it('should pre-compute display fields', () => {
    const polo = component.filteredAlugueis.find(a => a.modeloCarro === 'POLO')!;
    const gol = component.filteredAlugueis.find(a => a.modeloCarro === 'GOL')!;

    expect(polo.kmFormatado).toBe('225.426');
    expect(polo.valorFormatado).toBe('R$ 675,00');
    expect(polo.telefoneFormatado).toBe('(65) 99184-2240');
    expect(polo.pagoDisplay).toBe('NÃO');
    expect(polo.pagoSeverity).toBe('danger');
    expect(gol.pagoDisplay).toBe('SIM');
    expect(gol.pagoSeverity).toBe('success');
  });

  it('should build modelo options', () => {
    expect(component.modeloOptions.length).toBe(3);
    expect(component.modeloOptions[0].label).toBe('Todos');
  });

  it('should filter by modelo', () => {
    component.filterModelo = 'POLO';
    component.buscar();
    expect(component.filteredAlugueis.length).toBe(1);
    expect(component.filteredAlugueis[0].modeloCarro).toBe('POLO');
  });

  it('should recalculate valorTotalNaoPago on filter', () => {
    component.filterModelo = 'GOL';
    component.buscar();
    expect(component.valorTotalNaoPago).toBe(0);
  });

  it('should format valor correctly', () => {
    expect(component.formatValor(675)).toBe('R$ 675,00');
  });

  it('should format valorTotalFormatado on load', () => {
    expect(component.valorTotalFormatado).toBe('R$ 675,00');
  });
});
