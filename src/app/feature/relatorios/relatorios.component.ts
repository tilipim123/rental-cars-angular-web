import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TitleContentComponent } from '../../shared/components/title-content/title-content.component';
import { RentalApiService, AluguelItem } from '../../shared/services/rental-api.service';
import { NotificationService } from '../../shared/services/notification.service';

interface ModeloOption {
  label: string;
  value: string | null;
}

interface AluguelDisplay extends AluguelItem {
  kmFormatado: string;
  valorFormatado: string;
  telefoneFormatado: string;
  pagoDisplay: string;
  pagoSeverity: 'success' | 'danger';
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    TagModule,
    TitleContentComponent,
  ],
  providers: [DecimalPipe],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
})
export class RelatoriosComponent implements OnInit {
  alugueis: AluguelItem[] = [];
  filteredAlugueis: AluguelDisplay[] = [];
  valorTotalNaoPago = 0;
  valorTotalFormatado = 'R$ 0,00';

  filterDate: Date | null = null;
  filterModelo: string | null = null;
  modeloOptions: ModeloOption[] = [{ label: 'Todos', value: null }];

  isLoading = false;

  constructor(
    private rentalApiService: RentalApiService,
    private decimalPipe: DecimalPipe,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.rentalApiService.getAlugueis().subscribe({
      next: (response) => {
        this.alugueis = response.alugueis;
        this.filteredAlugueis = this.alugueis.map(a => this.toDisplay(a));
        this.valorTotalNaoPago = response.valorTotalNaoPago;
        this.valorTotalFormatado = this.formatValor(this.valorTotalNaoPago);
        this.buildModeloOptions();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.errorMessage(
          'Erro',
          'Não foi possível carregar os aluguéis. Tente novamente.'
        );
      },
    });
  }

  private toDisplay(a: AluguelItem): AluguelDisplay {
    return {
      ...a,
      kmFormatado: this.decimalPipe.transform(a.kmCarro, '1.0-0', 'pt-BR') || '0',
      valorFormatado: this.formatValor(a.valor),
      telefoneFormatado: this.formatTelefone(a.telefoneCliente),
      pagoDisplay: a.pago === 'SIM' ? 'SIM' : 'NÃO',
      pagoSeverity: a.pago === 'SIM' ? 'success' : 'danger',
    };
  }

  private buildModeloOptions(): void {
    const modelos = [...new Set(this.alugueis.map((a) => a.modeloCarro))];
    this.modeloOptions = [
      { label: 'Todos', value: null },
      ...modelos.map((m) => ({ label: m, value: m })),
    ];
  }

  buscar(): void {
    const filtered = this.alugueis.filter((a) => {
      let matchDate = true;
      let matchModelo = true;

      if (this.filterDate) {
        const day = String(this.filterDate.getDate()).padStart(2, '0');
        const month = String(this.filterDate.getMonth() + 1).padStart(2, '0');
        const year = this.filterDate.getFullYear();
        const dateStr = `${day}/${month}/${year}`;
        matchDate = a.dataAluguel === dateStr;
      }

      if (this.filterModelo) {
        matchModelo = a.modeloCarro === this.filterModelo;
      }

      return matchDate && matchModelo;
    });

    this.filteredAlugueis = filtered.map(a => this.toDisplay(a));

    this.valorTotalNaoPago = filtered
      .filter((a) => a.pago === 'NAO')
      .reduce((sum, a) => sum + a.valor, 0);
    this.valorTotalFormatado = this.formatValor(this.valorTotalNaoPago);
  }

  formatValor(valor: number): string {
    return 'R$ ' + (this.decimalPipe.transform(valor, '1.2-2', 'pt-BR') || '0,00');
  }

  private formatTelefone(telefone: string): string {
    if (!telefone) return '';
    const match = telefone.match(/\+55\((\d{2})\)(\d{5})-(\d{4})/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefone;
  }
}
