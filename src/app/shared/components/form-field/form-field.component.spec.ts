import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';

import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [FormFieldComponent, FormsModule],
  template: `
    <app-form-field id="test" label="Test Label">
      <input type="text" [(ngModel)]="value" />
    </app-form-field>
  `,
})
class TestHostComponent {
  value = '';
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const formField = fixture.debugElement.children[0].componentInstance;
    expect(formField).toBeTruthy();
  });
});
