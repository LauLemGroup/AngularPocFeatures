import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { FormModulesPocSignals } from './form-modules-poc-signals';

describe('FormModulesPocSignals', () => {
  let component: FormModulesPocSignals;
  let fixture: ComponentFixture<FormModulesPocSignals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormModulesPocSignals],
      providers: [
        provideRouter([
          {
            path: 'test/:numberOfTest',
            component: FormModulesPocSignals,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormModulesPocSignals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Validation du champ name ---

  describe('name validation', () => {
    it('should report a required error when name is empty', () => {
      component.userModel.update(m => ({ ...m, name: '' }));
      fixture.detectChanges();
      const errors = component.loginForm.name().errors();
      expect(errors.some(e => e.kind === 'required')).toBe(true);
    });

    it('should report a minLength error when name is shorter than 3 chars', () => {
      component.userModel.update(m => ({ ...m, name: 'Le' }));
      fixture.detectChanges();
      const errors = component.loginForm.name().errors();
      expect(errors.some(e => e.kind === 'minLength')).toBe(true);
    });

    it('should report ErrorNameKey when name does not start with "Lem"', () => {
      component.userModel.update(m => ({ ...m, name: 'Alexandre' }));
      fixture.detectChanges();
      const errors = component.loginForm.name().errors();
      expect(errors.some(e => e.kind === 'ErrorNameKey')).toBe(true);
    });

    it('should have no errors when name starts with "Lem" and is long enough', () => {
      component.userModel.update(m => ({ ...m, name: 'Lemaire' }));
      fixture.detectChanges();
      const errors = component.loginForm.name().errors();
      expect(errors.length).toBe(0);
    });
  });

  // --- Validation conditionnelle du prénom ---

  describe('prenom conditional validation', () => {
    it('should report required error when prenom is empty by default', () => {
      component.userModel.update(m => ({ ...m, prenom: '' }));
      fixture.detectChanges();
      const errors = component.loginForm.prenom().errors();
      expect(errors.some(e => e.kind === 'required')).toBe(true);
    });

    it('should NOT require prenom when name contains "AAA"', () => {
      component.userModel.update(m => ({ ...m, name: 'LemAAA', prenom: '' }));
      fixture.detectChanges();
      const errors = component.loginForm.prenom().errors();
      expect(errors.some(e => e.kind === 'required')).toBe(false);
    });
  });

  // --- Validateur de groupe (équivalent groupPrenomValidator) ---

  describe('group validator', () => {
    it('should report ErrorPrenomKey on root when prenom does not start with "Alex"', () => {
      component.userModel.update(m => ({ ...m, prenom: 'Pierre' }));
      fixture.detectChanges();
      const errors = component.loginForm().errors();
      expect(errors.some(e => e.kind === 'ErrorPrenomKey')).toBe(true);
    });

    it('should NOT report ErrorPrenomKey when name contains "AAA"', () => {
      component.userModel.update(m => ({ ...m, name: 'LemAAA', prenom: 'Pierre' }));
      fixture.detectChanges();
      const errors = component.loginForm().errors();
      expect(errors.some(e => e.kind === 'ErrorPrenomKey')).toBe(false);
    });
  });

  // --- Validation du ZIP ---

  describe('address.zip validation', () => {
    it('should report required error when zip is empty', () => {
      component.userModel.update(m => ({ ...m, address: { ...m.address, zip: '' } }));
      fixture.detectChanges();
      const errors = component.loginForm.address.zip().errors();
      expect(errors.some(e => e.kind === 'required')).toBe(true);
    });

    it('should have no zip error when zip is filled', () => {
      component.userModel.update(m => ({ ...m, address: { ...m.address, zip: '75000' } }));
      fixture.detectChanges();
      const errors = component.loginForm.address.zip().errors();
      expect(errors.some(e => e.kind === 'required')).toBe(false);
    });
  });

  // --- Validation de champAsync ---

  describe('champAsync validation', () => {
    it('should report asyncError when value starts with "A"', () => {
      component.userModel.update(m => ({ ...m, champAsync: 'Alexandre' }));
      fixture.detectChanges();
      const errors = component.loginForm.champAsync().errors();
      expect(errors.some(e => e.kind === 'asyncError')).toBe(true);
    });

    it('should have no asyncError when value does not start with "A"', () => {
      component.userModel.update(m => ({ ...m, champAsync: 'Bonjour' }));
      fixture.detectChanges();
      const errors = component.loginForm.champAsync().errors();
      expect(errors.some(e => e.kind === 'asyncError')).toBe(false);
    });
  });

  // --- addChamp / removeChamp ---

  describe('champs dynamiques', () => {
    it('should add a champ to the list', () => {
      const initialLength = component.userModel().champs.length;
      (component as any).addChamp();
      expect(component.userModel().champs.length).toBe(initialLength + 1);
    });

    it('should remove a champ at the given index', () => {
      component.userModel.update(m => ({
        ...m,
        champs: [
          { first: 'a', second: 'b' },
          { first: 'c', second: 'd' },
        ],
      }));
      (component as any).removeChamp(0);
      expect(component.userModel().champs.length).toBe(1);
      expect(component.userModel().champs[0].first).toBe('c');
    });
  });

  // --- onSubmit ---

  describe('onSubmit', () => {
    it('should patch name to "AlexOlolo" on submit', () => {
      (component as any).onSubmit();
      expect(component.userModel().name).toBe('AlexOlolo');
    });
  });

  // --- redirectToHome ---

  describe('redirectToHome', () => {
    it('should navigate to "/"', () => {
      const router = TestBed.inject(Router);
      const spy = vi.spyOn(router, 'navigate');
      (component as any).redirectToHome();
      expect(spy).toHaveBeenCalledWith(['/']);
    });
  });
});
