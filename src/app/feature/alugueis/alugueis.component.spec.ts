import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { AlugueisComponent } from './alugueis.component';
import { RentalApiService } from '../../shared/services/rental-api.service';

describe('AlugueisComponent', () => {
  let component: AlugueisComponent;
  let fixture: ComponentFixture<AlugueisComponent>;
  let mockRentalApi: jasmine.SpyObj<RentalApiService>;

  beforeEach(async () => {
    mockRentalApi = jasmine.createSpyObj('RentalApiService', ['uploadArquivo']);

    await TestBed.configureTestingModule({
      imports: [AlugueisComponent],
      providers: [
        MessageService,
        { provide: RentalApiService, useValue: mockRentalApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlugueisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject non-rtn files', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBeNull();
  });

  it('should accept rtn files', () => {
    const file = new File(['content'], 'test.rtn', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBe(file);
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(500)).toBe('500B');
    expect(component.formatFileSize(1500)).toBe('1.5KB');
    expect(component.formatFileSize(1500000)).toBe('1.4MB');
  });

  it('should handle upload success', () => {
    const file = new File(['content'], 'test.rtn', { type: 'text/plain' });
    component.selectedFile = file;
    mockRentalApi.uploadArquivo.and.returnValue(of({ mensagem: 'ok', registrosCriados: 1 }));

    component.processarArquivo();

    expect(component.uploadSuccess).toBeTrue();
  });

  it('should handle upload error', () => {
    const file = new File(['content'], 'test.rtn', { type: 'text/plain' });
    component.selectedFile = file;
    mockRentalApi.uploadArquivo.and.returnValue(throwError(() => ({ error: { mensagem: 'Erro' } })));

    component.processarArquivo();

    expect(component.uploadSuccess).toBeFalse();
    expect(component.isUploading).toBeFalse();
  });

  it('should remove file', () => {
    component.selectedFile = new File([''], 'test.rtn');
    component.removeFile();
    expect(component.selectedFile).toBeNull();
    expect(component.uploadSuccess).toBeFalse();
  });
});
