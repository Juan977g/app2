import { Component, inject } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  imports: [],
  selector: 'app-item-list',
  styleUrl: './item-list.css',
  templateUrl: './item-list.html',
})
export class ItemList {
  private readonly itemService = inject(ItemService);

  protected readonly items = this.itemService.items;

  protected toggle(item: Item): void {
    this.itemService.toggle(item);
  }
}
