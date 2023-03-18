import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { ItemErrorHandler } from './item.error.handler';
import { FilterComponent } from './filter/filter.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ItemService } from './item.service';

@NgModule({
    declarations: [
        AppComponent,
        ItemComponent,
        FilterComponent,
        ErrorDialogComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatDialogModule
    ],
    providers: [
        { provide: ErrorHandler, useClass: ItemErrorHandler },
        ItemService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
