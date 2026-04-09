import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RentalApiService } from '../../shared/services/rental-api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TitleContentComponent } from '../../shared/components/title-content/title-content.component';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-alugueis',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TitleContentComponent,
    ProgressBarModule,
  ],
  templateUrl: './alugueis.component.html',
  styleUrl: './alugueis.component.scss',
})
export class AlugueisComponent implements OnDestroy {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadSuccess = false;
  isDragging = false;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private rentalApiService: RentalApiService,
    private notificationService: NotificationService
  ) {}

  ngOnDestroy(): void {
    this.clearProgress();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  private validateAndSetFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.rtn')) {
      this.notificationService.errorMessage('Erro', 'Apenas arquivos com extensão .rtn são aceitos.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.notificationService.errorMessage('Erro', 'O tamanho do arquivo não pode ser maior que 10MB.');
      return;
    }

    this.selectedFile = file;
    this.uploadSuccess = false;
  }

  private clearProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.uploadSuccess = false;
    this.uploadProgress = 0;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  }

  processarArquivo(): void {
    if (!this.selectedFile) {
      this.notificationService.errorMessage('Erro', 'Selecione um arquivo antes de processar.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this.progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    this.rentalApiService.uploadArquivo(this.selectedFile).subscribe({
      next: () => {
        this.clearProgress();
        this.uploadProgress = 100;
        this.isUploading = false;
        this.uploadSuccess = true;
        this.notificationService.successMessage(
          'Sucesso', 'Arquivo processado com sucesso'
        );
      },
      error: (error) => {
        this.clearProgress();
        this.isUploading = false;
        this.uploadProgress = 0;
        const msg = error.error?.mensagem || 'Erro ao processar o arquivo.';
        this.notificationService.errorMessage('Erro', msg);
      },
    });
  }
}
