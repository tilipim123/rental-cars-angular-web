import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MessageService, useValue: spy },
      ],
    });
    service = TestBed.inject(NotificationService);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call successMessage', () => {
    service.successMessage('Title', 'Message');
    expect(messageService.add).toHaveBeenCalledWith({
      key: 'app',
      severity: 'success',
      summary: 'Title',
      detail: 'Message',
    });
  });

  it('should call errorMessage', () => {
    service.errorMessage('Error', 'Something failed');
    expect(messageService.add).toHaveBeenCalledWith({
      key: 'app',
      severity: 'error',
      summary: 'Error',
      detail: 'Something failed',
    });
  });
});
