import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModulesPoc } from './form-modules-poc';

describe('FormModulesPoc', () => {
  let component: FormModulesPoc;
  let fixture: ComponentFixture<FormModulesPoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormModulesPoc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormModulesPoc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
