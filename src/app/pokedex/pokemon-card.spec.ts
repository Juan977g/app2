import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCard } from './pokemon-card';
import { PokemonService } from './pokemon.service';

class MockPokemonService {
  spriteUrl(id: number) {
    return `https://example.com/${id}.png`;
  }
}

describe('PokemonCard', () => {
  let component: PokemonCard;
  let fixture: ComponentFixture<PokemonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCard],
      providers: [{ provide: PokemonService, useClass: MockPokemonService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pokemon', { id: 25, name: 'pikachu' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the padded number, name and sprite url', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.number')?.textContent).toContain('#025');
    expect(compiled.querySelector('.name')?.textContent).toContain('pikachu');
    expect(compiled.querySelector('img')?.getAttribute('src')).toBe('https://example.com/25.png');
  });

  it('should emit the pokemon when clicked', () => {
    const emitted: unknown[] = [];
    component.select.subscribe((p) => emitted.push(p));
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(emitted).toEqual([{ id: 25, name: 'pikachu' }]);
  });
});
