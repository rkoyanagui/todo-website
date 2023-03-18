import { Component, ErrorHandler } from '@angular/core';
import { Filter } from './filter';
import { Item } from './item';
import { ItemService } from './item.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'todo-website';
    allItems: Item[] = [];
    currentFilter: Filter = 'all';

    constructor(private itemService: ItemService, private errorHandler: ErrorHandler) { }

    ngOnInit() {
        this.fetchItems(this.currentFilter);
    }

    get items() {
        return this.allItems;
    }

    fetchItems(filter: Filter): Filter {
        this.itemService.fetchItems(filter).subscribe({
            next: data => {
                this.allItems = data;
                console.log('Fetched items: ' + JSON.stringify(data));
            },
            error: error => this.errorHandler.handleError(error)
        });
        return filter;
    }

    addItem(description: string): void {
        const newItem = {
            description: description,
            done: false
        };
        this.itemService.addItem(newItem).subscribe({
            next: data => {
                console.log('Added item: ' + JSON.stringify(data));
                this.ngOnInit();
            },
            error: error => this.errorHandler.handleError(error)
        });
    }

    removeItem(item: Item): void {
        this.itemService.removeItem(item).subscribe({
            next: data => {
                console.log('Removed item: ' + JSON.stringify(data));
                this.ngOnInit();
            },
            error: error => this.errorHandler.handleError(error)
        });
    }
}
