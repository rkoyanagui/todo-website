import { ErrorHandler } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ItemErrorHandler } from './item.error.handler';

describe('ItemErrorHandler', () => {
    const dialog = {
        'open': jest.fn()
    };
    let errorHandler: ErrorHandler;

    beforeEach(() => {
        dialog.open.mockClear();

        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: dialog },
                { provide: ErrorHandler, useClass: ItemErrorHandler }
            ]
        });

        errorHandler = TestBed.inject(ErrorHandler);
    });

    it('should handle an ErrorEvent', () => {
        const error = new HttpErrorResponse({
            error: new ErrorEvent('fake error', { message: "Hi, I'm an error" })
        });

        errorHandler.handleError(error);

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { message: "An error occurred: Hi, I'm an error" };
        expect(dialog.open).toHaveBeenCalledWith(ErrorDialogComponent, dialogConfig);
    });

    it('should handle a generic error', () => {
        const error = new HttpErrorResponse({
            error: { error: "Hi, I'm an error" }
        });

        errorHandler.handleError(error);

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { message: "Hi, I'm an error" };
        expect(dialog.open).toHaveBeenCalledWith(ErrorDialogComponent, dialogConfig);
    });
});
