import { Injectable, ErrorHandler } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable()
export class ItemErrorHandler implements ErrorHandler {

    constructor(private dialog: MatDialog) { }

    handleError(error: any): void {
        if (error.error instanceof ErrorEvent) {
            const msg = 'An error occurred: ' + error.error.message;
            console.error(msg);
            this.openDialog(msg);
        } else {
            let msg = 'unknown error';
            if (error.error.error) {
                msg = error.error.error;
            } else if (error.error.description) {
                msg = error.error.description;
            }
            console.error(msg);
            this.openDialog(msg);
        }
    }

    private openDialog(msg: string): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { message: msg };
        this.dialog.open(ErrorDialogComponent, dialogConfig);
    }
}
