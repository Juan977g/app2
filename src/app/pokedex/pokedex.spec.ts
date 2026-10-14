import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Pokedex } from './pokedex';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon';

const DETAIL: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { id: 13, name: 'electric' } }],
  stats: [{ base_stat: 35, stat: { name: 'hp' } }],
  sprites: {},
};

class MockPokemonService {
  getPokemonList() {
    return of([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
    ]);
  }

  getTypes() {
    return of([
      { id: 13, name: 'electric' },
      { id: 10, name: 'fire' },
    ]);
  }

  getPokemonByType(type: string) {
    return of(type === 'fire' ? [{ id: 4, name: 'charmander' }] : []);
  }

  getPokemon() {
    return of(DETAIL);
  }

  spriteUrl(id: number) {
    return `sprite-${id}.png`;
  }
}

describe('Pokedex', () => {
  let component: Pokedex;
  let fixture: ComponentFixture<Pokedex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pokedex],
      providers: [{ provide: PokemonService, useClass: MockPokemonService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Pokedex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function setInput(value: string): void {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function setSelect(value: string): void {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one card per pokemon', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-pokemon-card');
    expect(cards.length).toBe(2);
  });

  it('should filter the grid by name', () => {
    setInput('pika');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-pokemon-card');
    expect(cards.length).toBe(1);
  });

  it('should show the empty state when nothing matches', () => {
    setInput('zzzzz');
    fixture.detectChanges();
    const status: HTMLElement = fixture.nativeElement.querySelector('.status');
    expect(status.textContent).toContain('Sin resultados');
  });

  it('should replace the list with the selected type', async () => {
    setSelect('fire');
    await fixture.whenStable();
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-pokemon-card');
    expect(cards.length).toBe(1);
  });

  it('should open the detail dialog when a card is selected', async () => {
    const card = fixture.nativeElement.querySelector('app-pokemon-card');
    card.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();
    const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.textContent).toContain('pikachu');
  });
});
