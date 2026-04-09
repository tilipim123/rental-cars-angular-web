import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default username', () => {
    expect(component.username).toBe('Usuário');
  });

  it('should generate initials on init', () => {
    expect(component.initialsName).toBe('U');
  });

  it('should extract initials from full name', () => {
    component.getInitials('Lucas Almada');
    expect(component.initialsName).toBe('LA');
  });

  it('should handle single name', () => {
    component.getInitials('Lucas');
    expect(component.initialsName).toBe('L');
  });
});
