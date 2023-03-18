import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { Item } from './item';
import { ItemService } from './item.service';

describe('ItemService', () => {
    const httpClient = {
        'get': jest.fn(),
        'post': jest.fn(),
        'put': jest.fn(),
        'delete': jest.fn()
    };
    let itemService: ItemService;

    beforeEach(() => {
        httpClient.get.mockClear();
        httpClient.post.mockClear();
        httpClient.put.mockClear();
        httpClient.delete.mockClear();

        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpClient },
                ItemService
            ]
        });

        itemService = TestBed.inject(ItemService);
    });

    describe('fetching items', () => {
        it('should fetch all items', (done: jest.DoneCallback) => {
            const expectedItems: Item[] = [
                { description: 'a', done: false },
                { description: 'b', done: true }
            ];

            httpClient.get.mockReturnValue(of(expectedItems));

            itemService.fetchItems('all').subscribe({
                next: data => {
                    expect(data).toEqual(expectedItems);
                    done();
                },
                error: done.fail
            });

            expect(httpClient.get).toHaveBeenCalled();
        });

        it('should fetch active items', (done: jest.DoneCallback) => {
            const expectedItems: Item[] = [
                { description: 'a', done: false }
            ];

            httpClient.get.mockReturnValue(of(expectedItems));

            itemService.fetchItems('active').subscribe({
                next: data => {
                    expect(data).toEqual(expectedItems);
                    done();
                },
                error: done.fail
            });

            expect(httpClient.get).toHaveBeenCalled();
        });

        it('should fetch done items', (done: jest.DoneCallback) => {
            const expectedItems: Item[] = [
                { description: 'b', done: true }
            ];

            httpClient.get.mockReturnValue(of(expectedItems));

            itemService.fetchItems('done').subscribe({
                next: data => {
                    expect(data).toEqual(expectedItems);
                    done();
                },
                error: done.fail
            });

            expect(httpClient.get).toHaveBeenCalled();
        });
    });

    it('should add one item', (done: jest.DoneCallback) => {
        const item: Item = { description: 'a', done: false };

        httpClient.post.mockReturnValue(of(item));

        itemService.addItem(item).subscribe({
            next: data => {
                expect(data).toEqual(item);
                done();
            },
            error: done.fail
        });

        expect(httpClient.post).toHaveBeenCalled();
    });

    it('should not add a duplicated item', (done: jest.DoneCallback) => {
        const item: Item = { description: 'a', done: false };
        const errorResponseBody = {
            status: 409,
            error: 'Could not save TODO item TodoDto(description=a, done=false). It may be duplicated.'
        };
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({
            status: 409,
            statusText: 'Conflict',
            error: JSON.stringify(errorResponseBody)
        });

        httpClient.post.mockReturnValue(asyncError(errorResponse));

        itemService.addItem(item).subscribe({
            next: data => done.fail('expected an error'),
            error: error => {
                expect(error.error).toContain("{\"status\":409,\"error\":\"Could not save TODO item TodoDto(description=a, done=false). It may be duplicated.\"}");
                done();
            }
        });

        expect(httpClient.post).toHaveBeenCalled();
    });

    it('should remove one item', (done: jest.DoneCallback) => {
        const item: Item = { description: 'a', done: false };

        httpClient.delete.mockReturnValue(of(null));

        itemService.removeItem(item).subscribe({
            next: data => {
                expect(data).toBeNull();
                done();
            },
            error: done.fail
        });

        expect(httpClient.delete).toHaveBeenCalled();
    });

    it('should update one item', (done: jest.DoneCallback) => {
        const originalDescription = 'a';
        const newDescription = 'b';
        const updatedItem: Item = { description: 'b', done: true };

        httpClient.put.mockReturnValue(of(updatedItem));

        itemService.updateItem(originalDescription, newDescription, true).subscribe({
            next: data => {
                expect(data).toEqual(updatedItem);
                done();
            },
            error: done.fail
        });

        expect(httpClient.put).toHaveBeenCalled();
    });

    it('should not update an item with a duplicated description', (done: jest.DoneCallback) => {
        const originalDescription = 'a';
        const newDescription = 'b';
        const errorResponseBody = {
            status: 409,
            error: 'Could not save TODO item TodoDto(description=b, done=true). It may be duplicated.'
        };
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({
            status: 409,
            statusText: 'Conflict',
            error: JSON.stringify(errorResponseBody)
        });

        httpClient.put.mockReturnValue(asyncError(errorResponse));

        itemService.updateItem(originalDescription, newDescription, true).subscribe({
            next: data => done.fail('expected an error'),
            error: error => {
                expect(error.error).toContain("{\"status\":409,\"error\":\"Could not save TODO item TodoDto(description=b, done=true). It may be duplicated.\"}");
                done();
            }
        });

        expect(httpClient.put).toHaveBeenCalled();
    });
});

export function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
}
