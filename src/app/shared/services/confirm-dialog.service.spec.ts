import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmDialogService, ConfirmationService, MessageService],
    });
    service = TestBed.inject(ConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
