import {ChangeDetectionStrategy, Component, computed, inject, Signal, signal} from '@angular/core';
import {ActivatedRoute, Router, ROUTER_OUTLET_DATA} from '@angular/router';
import {map, of} from 'rxjs';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {form, FormField, minLength, required, validate, validateAsync, validateTree} from '@angular/forms/signals';

interface ChampItem {
    first: string;
    second: string;
}

interface UserFormModel {
    name: string;
    birthday: Date | null;
    preferences: {
        theme: string;
        notifications: boolean;
    };
    tags: string[];
    prenom: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    champAsync: string;
    champs: ChampItem[];
}

@Component({
    selector: 'app-form-modules-poc-signals',
    imports: [FormField],
    templateUrl: './form-modules-poc-signals.html',
    styleUrl: './form-modules-poc-signals.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModulesPocSignals {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly message = inject<Signal<string>>(ROUTER_OUTLET_DATA);

    userModel = signal<UserFormModel>({
        name: '',
        birthday: null,
        preferences: {
            theme: 'dark',
            notifications: true,
        },
        tags: [],
        prenom: 'Alexandre',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '123',
        },
        champAsync: 'B',
        champs: [{first: '', second: ''}],
    });

    private createFactory() {
        return (params: Signal<{ champAsync: string; name: string } | undefined>) =>
            rxResource<{ asyncError: { value: string } } | null, { champAsync: string; name: string }>({
                params: () => params() ?? {champAsync: '', name: ''},
                stream: ({params: value}) => {
                    console.log(value.champAsync.startsWith('A') && value.name.startsWith('A')); // log name
                    return of(
                        value.champAsync.startsWith('A') && value.name.startsWith('A')
                            ? {asyncError: {value: 'Async validation failed'}}
                            : null,
                    );
                },
            });
    }

    loginForm = form(this.userModel, schemaPath => {
        // Validators portés depuis FormModulesPoc — version signals
        required(schemaPath.name, {message: 'Name is required'});
        minLength(schemaPath.name, 3, {message: 'Name must be at least 3 characters'});
        validate(schemaPath.name, ctx => {
            const value = ctx.value();
            return value?.startsWith('Lem') || value?.startsWith('A')
                ? null
                : [{kind: 'ErrorNameKey', message: 'Name must start with "Lem"'}];
        });

        // Validateur conditionnel : prénom requis sauf si le nom contient "AAA"
        required(schemaPath.prenom, {
            message: 'Prénom is required',
            when: ctx => !ctx.valueOf(schemaPath.name)?.includes('AAA'),
        });

        // Validateur de groupe : prénom doit commencer par "Alex" (équivalent à groupPrenomValidator)
        validateTree(schemaPath, ctx => {
            const {prenom, name} = ctx.value();
            if (name?.includes('AAA')) return null;
            return prenom?.startsWith('Alex')
                ? null
                : [{kind: 'ErrorPrenomKey', message: 'Prénom must start with "Alex"'}];
        });

        required(schemaPath.address.zip, {message: 'ZIP is required'});

        validateAsync(schemaPath.champAsync, this.champAsyncValidator());
    });

    readonly numberOfTest = toSignal(
        this.route.paramMap.pipe(
            map(paramMap => {
                const value = paramMap.get('numberOfTest');
                return value === null ? 1 : Number(value);
            }),
        ),
        {initialValue: undefined},
    );

    nameLength = computed(() => this.loginForm.name().value().length);

    private champAsyncValidator() {
        return {
            params: (ctx: { value: () => string }) => ({
                champAsync: ctx.value(),
                name: this.loginForm.name().value(),
            }),
            factory: this.createFactory(),
            onSuccess: (result: { asyncError: { value: string } } | null | undefined) =>
                result ? [{kind: 'asyncError', message: 'Async validation failed'}] : null,
            onError: () => null,
        };
    }


    protected addOne(): void {
        const nextValue = (this.numberOfTest() ?? 0) + 1;
        this.router.navigate(['test', nextValue], {relativeTo: this.route.parent});
    }

    protected redirectToHome(): void {
        this.router.navigate(['/']);
    }

    protected onSubmit(): void {
        console.warn(this.userModel());
        this.userModel.update(model => ({...model, name: 'Changement du champ Nom !'}));
    }

    protected addChamp(): void {
        this.userModel.update(model => ({
            ...model,
            champs: [...model.champs, {first: '', second: ''}],
        }));
    }

    protected removeChamp(index: number): void {
        this.userModel.update(model => ({
            ...model,
            champs: model.champs.filter((_, i) => i !== index),
        }));
    }
}
