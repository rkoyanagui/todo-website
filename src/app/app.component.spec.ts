import { ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { AppComponent } from './app.component';
import { Item } from './item';
import { ItemComponent } from './item/item.component';
import { ItemService } from './item.service';
import { FilterComponent } from './filter/filter.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

describe('AppComponent', () => {
    const itemService = {
        'fetchItems': jest.fn(),
        'addItem': jest.fn(),
        'removeItem': jest.fn()
    };
    const errorHandler = {
        'handleError': jest.fn()
    };
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;

    beforeEach(async () => {
        itemService.fetchItems.mockClear();
        itemService.addItem.mockClear();
        itemService.removeItem.mockClear();
        errorHandler.handleError.mockClear();

        await TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                ErrorDialogComponent,
                FilterComponent,
                ItemComponent
            ],
            providers: [
                { provide: ItemService, useValue: itemService },
                { provide: ErrorHandler, useValue: errorHandler }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it("should have as title 'todo-website'", () => {
        expect(app.title).toEqual('todo-website');
    });

    it('should render title and items', () => {
        const fetchedItems = new Observable<Item[]>(observer => {
            observer.next([
                { description: 'walk the cat', done: false },
                { description: 'walk the dog', done: true }
            ])
        });
        itemService.fetchItems.mockReturnValue(fetchedItems);

        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('My To-Do List');

        const itemList = Array.from(compiled.querySelectorAll('label'))
            .map(node => node.textContent);
        expect(itemList).toContain('walk the cat');
        expect(itemList).toContain('walk the dog');
    });

    it('should handle an error when trying to fetch items', () => {
        const fetchedItems = new Observable<Item[]>(observer => observer.error());
        itemService.fetchItems.mockReturnValue(fetchedItems);

        fixture.detectChanges();
        expect(errorHandler.handleError).toHaveBeenCalled();
    });

    it('should add an item to the to-do list', () => {
        const newItem = new Observable<Item>(observer => {
            observer.next({ description: 'new item', done: false })
        });
        itemService.addItem.mockReturnValue(newItem);

        const refreshedItems = new Observable<Item[]>(observer => {
            observer.next([
                { description: 'original item', done: false },
                { description: 'new item', done: false }
            ])
        });
        itemService.fetchItems.mockReturnValue(refreshedItems);

        app.addItem('new item');
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const itemList = Array.from(compiled.querySelectorAll('label'))
            .map(node => node.textContent);

        expect(itemList).toContain('new item');
        expect(itemService.addItem).toHaveBeenCalledWith({ description: 'new item', done: false });
        expect(itemService.fetchItems).toHaveBeenCalledTimes(2);
    });

    it('should handle an error when trying to add an item', () => {
        const error = new Observable<Item>(observer => observer.error());
        itemService.addItem.mockReturnValue(error);

        const refreshedItems = new Observable<Item[]>(observer => { });
        itemService.fetchItems.mockReturnValue(refreshedItems);

        app.addItem('new item');
        expect(errorHandler.handleError).toHaveBeenCalled();
        fixture.detectChanges();
    });

    it('should remove an item from the to-do list', () => {
        const stubResponse = new Observable<null>(observer => observer.next(null));
        itemService.removeItem.mockReturnValue(stubResponse);

        const refreshedItems = new Observable<Item[]>(observer => {
            observer.next([
                { description: 'some other item', done: false }
            ])
        });
        itemService.fetchItems.mockReturnValue(refreshedItems);

        app.removeItem({ description: 'removed item', done: false });
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const itemList = Array.from(compiled.querySelectorAll('label'))
            .map(node => node.textContent);

        expect(itemList).not.toContain('removed item');
        expect(itemService.removeItem).toHaveBeenCalledWith({ description: 'removed item', done: false });
        expect(itemService.fetchItems).toHaveBeenCalledTimes(2);
    });

    it('should handle an error when trying to remove an item', () => {
        const error = new Observable<null>(observer => observer.error());
        itemService.removeItem.mockReturnValue(error);

        const refreshedItems = new Observable<Item[]>(observer => { });
        itemService.fetchItems.mockReturnValue(refreshedItems);

        app.removeItem({ description: 'removed item', done: false });
        expect(errorHandler.handleError).toHaveBeenCalled();
        fixture.detectChanges();
    });
});
