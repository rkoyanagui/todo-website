import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from "./item";
import { Filter } from "./filter";

@Injectable()
export class ItemService {
    url = 'http://localhost:8080/todo';

    constructor(private http: HttpClient) { }

    fetchItems(filter: Filter): Observable<Item[]> {
        let options = {};
        if (filter === 'done') {
            options = { params: { done: true } };
        } else if (filter === 'active') {
            options = { params: { done: false } };
        }
        return this.http.get<Item[]>(this.url, options);
    }

    addItem(item: Item): Observable<Item> {
        return this.http.post<Item>(this.url, item);
    }

    removeItem(item: Item): Observable<null> {
        return this.http.delete<null>(this.url, { body: item });
    }

    updateItem(originalDescription: string, description: string, done: boolean): Observable<Item> {
        let url = this.url + '/' + originalDescription;
        return this.http.put<Item>(url, { description, done });
    }
}
