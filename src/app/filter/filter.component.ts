import { Component, Output, EventEmitter } from '@angular/core';
import { Filter } from '../filter';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent {
    filter: Filter = 'all';
    @Output() refresh = new EventEmitter<Filter>();
}
