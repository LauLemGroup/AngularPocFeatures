import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { FormModulesPoc } from './form-modules-poc';

describe('FormModulesPoc', () => {
  let component: FormModulesPoc;
  let fixture: ComponentFixture<FormModulesPoc>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormModulesPoc],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FormModulesPoc);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('nameValidator', () => {
    it('should return null when name starts with "Lem"', () => {
      const validator = component.nameValidator();
      const control = component.profileForm.controls.name;
      control.setValue('Lemaire');

      // Jest — toBeNull() : vérifie que la valeur est strictement null
      expect(validator(control)).toBeNull();
    });

    it('should return an error when name does not start with "Lem"', () => {
      const validator = component.nameValidator();
      const control = component.profileForm.controls.name;
      control.setValue('Alexandre');

      const result = validator(control);

      // Jest — toBeDefined() : vérifie que la valeur n'est pas undefined
      expect(result).toBeDefined();
      // Jest — toHaveProperty() : vérifie qu'un objet possède une propriété
      expect(result).toHaveProperty('ErrorNameKey');
    });
  });

  // --- groupPrenomValidator ---

  describe('groupPrenomValidator', () => {
    it('should return null when prenom starts with "Alex"', () => {
      const validator = component.groupPrenomValidator();
      component.profileForm.controls.prenom.setValue('Alexandre');

      expect(validator(component.profileForm)).toBeNull();
    });

    it('should return an error when prenom does not start with "Alex"', () => {
      const validator = component.groupPrenomValidator();
      component.profileForm.controls.prenom.setValue('Pierre');

      const result = validator(component.profileForm);

      expect(result).toHaveProperty('ErrorPrenomKey');
    });
  });

  // --- addChamp / removeChamp ---

  describe('champs dynamiques', () => {
    it('should add a new champ to the FormArray', () => {
      const initialLength = component.champs.length;

      (component as any).addChamp();

      // Jest — toBe() avec calcul : vérifie la valeur exacte après ajout
      expect(component.champs.length).toBe(initialLength + 1);
    });

    it('should remove a champ at the given index', () => {
      (component as any).addChamp();
      const lengthBeforeRemove = component.champs.length;

      (component as any).removeChamp(0);

      expect(component.champs.length).toBe(lengthBeforeRemove - 1);
    });
  });

  // --- onSubmit ---

  describe('onSubmit', () => {
    it('should patch the form name to "AlexOlolo" on submit', () => {
      (component as any).onSubmit();

      expect(component.profileForm.controls.name.value).toBe('AlexOlolo');
    });
  });

  // --- redirectToHome ---

  describe('redirectToHome', () => {
    it('should navigate to "/"', () => {
      // .mockResolvedValue(true) empêche la vraie navigation (routes non définies en test)
      const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      (component as any).redirectToHome();

      expect(spy).toHaveBeenCalledWith(['/']);
    });
  });

  // --- Validation reactive : prenom ---

  describe('conditional prenom validation', () => {
    it('should remove prenom validators when name contains "AAA"', async () => {
      component.profileForm.controls.name.setValue('LemAAA');
      await fixture.whenStable();

      // Quand le nom contient "AAA", le prénom n'est plus requis
      component.profileForm.controls.prenom.setValue('');

      // Jest — toBeNull() : le champ ne doit plus avoir d'erreur required
      expect(component.profileForm.controls.prenom.errors).toBeNull();
    });

    it('should require prenom when name does NOT contain "AAA"', async () => {
      component.profileForm.controls.name.setValue('Lemaire');
      await fixture.whenStable();

      component.profileForm.controls.prenom.setValue('');

      expect(component.profileForm.controls.prenom.errors).toHaveProperty('required');
    });
  });
});
