import { ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { ItemService } from '../item.service';
import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
    const itemService = {
        'updateItem': jest.fn()
    };
    const errorHandler = {
        'handleError': jest.fn()
    };
    let component: ItemComponent;
    let fixture: ComponentFixture<ItemComponent>;
    let html: HTMLElement;

    beforeEach(async () => {
        itemService.updateItem.mockClear();
        errorHandler.handleError.mockClear();

        await TestBed.configureTestingModule({
            declarations: [ItemComponent],
            providers: [
                { provide: ItemService, useValue: itemService },
                { provide: ErrorHandler, useValue: errorHandler }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ItemComponent);
        component = fixture.componentInstance;
        component.item = { description: 'walk the dog', done: false };
        html = fixture.nativeElement;
    });

    it("should update the item's description", () => {
        const updatedItem = new Observable<Item>(observer => {
            observer.next({ description: 'walk the cat', done: false });
        });
        itemService.updateItem.mockReturnValue(updatedItem);

        component.saveItem('walk the cat');
        fixture.detectChanges();
        expect(html.querySelector('label')?.textContent).toContain('walk the cat');
    });

    it('should not update the item if the new description is empty', () => {
        component.saveItem('');
        expect(itemService.updateItem).not.toHaveBeenCalled();
    });

    it("should handle an error when trying to update the item's description", () => {
        const error = new Observable<Item>(observer => {
            observer.error("Hi, I'm an error");
        });
        itemService.updateItem.mockReturnValue(error);

        component.saveItem('walk the cat');
        expect(errorHandler.handleError).toHaveBeenCalled();
    });

    it("should update the item's status", () => {
        const updatedItem = new Observable<Item>(observer => {
            observer.next({ description: 'walk the dog', done: true });
        });
        itemService.updateItem.mockReturnValue(updatedItem);

        component.checkItem();
        fixture.detectChanges();
        expect(component.item.done).toBe(true);
    });

    it("should handle an error when trying to update the item's status", () => {
        const error = new Observable<Item>(observer => {
            observer.error("Hi, I'm an error");
        });
        itemService.updateItem.mockReturnValue(error);

        component.checkItem();
        expect(errorHandler.handleError).toHaveBeenCalled();
    });
});
