import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';

import {AppComponent} from './app-component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the two navigation buttons', () => {
        fixture.detectChanges();
        const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

        // Jest — toHaveLength() : vérifie la longueur d'un tableau ou d'une NodeList
        expect(buttons).toHaveLength(2);
    });

    describe('redirectToPocTest', () => {
        it('should navigate to "/formModulesPoc/test"', () => {
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

            component.redirectToPocTest();

            expect(spy).toHaveBeenCalledWith(['/formModulesPoc/test']);
        });
    });

    describe('redirectToPocSignalsTest', () => {
        it('should navigate to "/formModulesPocSignals/123/test/123"', () => {
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

            component.redirectToPocSignalsTest();

            expect(spy).toHaveBeenCalledWith(['/formModulesPocSignals/123/test/123']);
        });
    });
});
