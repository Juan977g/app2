import { TestBed } from '@angular/core/testing';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle the done flag of an item', () => {
    const first = service.items()[0];
    service.toggle(first);
    expect(service.items()[0].done).toBe(!first.done);
  });
});
