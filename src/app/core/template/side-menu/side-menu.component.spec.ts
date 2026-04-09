import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { SideMenuComponent } from './side-menu.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent, NoopAnimationsModule],
      providers: [MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    component.items = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu', () => {
    spyOn(component.toogle, 'emit');
    component.exibirMenu();
    expect(component.isOpenMenu).toBeFalse();
    expect(component.toogle.emit).toHaveBeenCalledWith(false);
  });
});
