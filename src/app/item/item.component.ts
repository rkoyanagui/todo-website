import { Component, Input, Output, EventEmitter, ErrorHandler } from '@angular/core';
import { ItemService } from '../item.service';
import { Item } from '../item';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent {
    editable = false;
    @Input() item!: Item;
    @Input() newItem!: string;
    @Output() remove = new EventEmitter<Item>();

    constructor(private itemService: ItemService, private errorHandler: ErrorHandler) { }

    saveItem(description: string): void {
        if (!description) return;
        this.editable = false;
        const originalDescription = this.item.description;
        this.itemService.updateItem(originalDescription, description, this.item.done).subscribe({
            next: data => {
                this.item = data;
                console.log('Updated item: ' + JSON.stringify(data));
            },
            error: error => this.errorHandler.handleError(error)
        });
    }

    checkItem(): void {
        this.itemService.updateItem(this.item.description, this.item.description, !this.item.done).subscribe({
            next: data => {
                this.item = data;
                console.log('Checked item: ' + JSON.stringify(data));
            },
            error: error => this.errorHandler.handleError(error)
        });
    }
}
