import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Carro {
  id: number;
  modelo: string;
  ano: string;
  qtdPassageiros: number;
  km: number;
  fabricante: string;
  vlrDiaria: number;
}

export interface AluguelItem {
  dataAluguel: string;
  modeloCarro: string;
  kmCarro: number;
  nomeCliente: string;
  telefoneCliente: string;
  dataDevolucao: string;
  valor: number;
  pago: string;
}

export interface AlugueisResponse {
  alugueis: AluguelItem[];
  valorTotalNaoPago: number;
}

export interface UploadResponse {
  mensagem: string;
  registrosCriados: number;
}

@Injectable({
  providedIn: 'root'
})
export class RentalApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCarros(): Observable<Carro[]> {
    return this.http.get<Carro[]>(`${this.baseUrl}/carros`);
  }

  uploadArquivo(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('arquivo', file);
    return this.http.post<UploadResponse>(`${this.baseUrl}/alugueis/upload`, formData);
  }

  getAlugueis(): Observable<AlugueisResponse> {
    return this.http.get<AlugueisResponse>(`${this.baseUrl}/alugueis`);
  }
}
