import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [MessageService, ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items', () => {
    expect(component.items.length).toBe(2);
    expect(component.items[0].label).toBe('Alugueis');
    expect(component.items[1].label).toBe('Relatórios');
  });

  it('should toggle menu', () => {
    expect(component.isOpenMenu).toBeTrue();
    component.exibirMenu(false);
    expect(component.isOpenMenu).toBeFalse();
    expect(component.hasOpen()).toBe('closed');
  });
});
