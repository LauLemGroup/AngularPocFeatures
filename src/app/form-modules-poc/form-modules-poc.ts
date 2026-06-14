import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    StatusChangeEvent,
    ValueChangeEvent,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {distinctUntilChanged, filter, map, Observable, of, startWith} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
    selector: 'app-form-modules-poc',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './form-modules-poc.html',
    styleUrl: './form-modules-poc.scss',
})
export class FormModulesPoc {
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    nameValidator(): ValidatorFn {
        return (control: AbstractControl<string>): ValidationErrors | null => {
            const name = control?.value;
            return name?.startsWith('Lem') ? null : {ErrorNameKey: {value: 'ErrorNameValue'}};
        };
    }

    groupPrenomValidator(): ValidatorFn {
        return (control: AbstractControl<string>): ValidationErrors | null => {
            const prenom = control.get('prenom')?.value;
            return prenom?.startsWith('Alex') ? null : {ErrorPrenomKey: {value: 'ErrorPrenomValue'}};
        };
    }

    private asyncValidatorTest() {
        return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
            return of(
                control.value.startsWith('A')
                    ? {asyncError: {value: 'Async validation failed'}}
                    : null
            );
        };
    }

    get champs(): FormArray {
        return this.profileForm.get('champs') as FormArray;
    }

    private readonly prenomValidators = [Validators.required];
    private readonly groupValidators = [this.groupPrenomValidator()];

    profileForm = new FormGroup(
        {
            name: new FormControl('Lemaire', [Validators.required, Validators.minLength(3), this.nameValidator()]),
            prenom: new FormControl('Alexandre', [Validators.required]),
            address: new FormGroup({
                street: new FormControl(''),
                city: new FormControl(''),
                state: new FormControl(''),
                zip: new FormControl('123', [Validators.required]),
            }),
            champAsync: new FormControl('B', [], this.asyncValidatorTest()),
            champs: this.formBuilder.array([
                this.formBuilder.group({
                    first: new FormControl(''),
                    second: new FormControl(''),
                }),
            ]),
        },
        {validators: this.groupPrenomValidator()}
    );

    constructor() {
        this.profileForm.events
            .pipe(
                filter(event => event instanceof StatusChangeEvent),
                takeUntilDestroyed(),
            )
            .subscribe(event => {
                console.log('FormModulesPocEvent', event);
            });

        this.profileForm.controls.name.events
            .pipe(
                filter(event => event instanceof ValueChangeEvent),
                map(event => (event as ValueChangeEvent<string>).value?.includes('AAA') ?? false),
                startWith(this.profileForm.controls.name.value?.includes('AAA') ?? false),
                distinctUntilChanged(),
                takeUntilDestroyed(),
            )
            .subscribe(hasAAA => {
                const prenomControl = this.profileForm.controls.prenom;
                if (hasAAA) {
                    prenomControl.clearValidators();
                    //this.profileForm.clearValidators();
                } else {
                    prenomControl.setValidators(this.prenomValidators);
                    //this.profileForm.setValidators(this.groupValidators);
                }
                prenomControl.updateValueAndValidity();
                //this.profileForm.updateValueAndValidity();
            });
    }

    protected redirectToHome(): void {
        this.router.navigate(['/']);
    }

    protected onSubmit(): void {
        console.warn(this.profileForm.value);
        this.profileForm.patchValue({name: 'AlexOlolo'});
    }

    protected addChamp(): void {
        this.champs.push(
            this.formBuilder.group({
                first: new FormControl('', {nonNullable: true}),
                second: new FormControl('', {nonNullable: true}),
            })
        );
    }

    protected removeChamp(index: number): void {
        this.champs.removeAt(index);
    }
}
