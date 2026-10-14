import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemList } from './item-list';

describe('ItemList', () => {
  let component: ItemList;
  let fixture: ComponentFixture<ItemList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemList],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the items provided by the service', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('li').length).toBe(3);
    expect(compiled.textContent).toContain('Definir la interfaz');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
