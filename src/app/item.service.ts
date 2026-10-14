import { Service, signal } from '@angular/core';
import { Item } from './item';

@Service()
export class ItemService {
  private readonly state = signal<Item[]>([
    { id: 1, name: 'Definir la interfaz', done: true },
    { id: 2, name: 'Crear el servicio', done: true },
    { id: 3, name: 'Crear el componente', done: false },
  ]);

  readonly items = this.state.asReadonly();

  toggle(item: Item): void {
    this.state.update((items) =>
      items.map((current) =>
        current.id === item.id ? { ...current, done: !current.done } : current,
      ),
    );
  }
}
