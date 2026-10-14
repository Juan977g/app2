import { Component, computed, inject, signal } from '@angular/core';
import { Pokemon, PokemonListItem, PokemonTypeItem } from './pokemon';
import { PokemonService } from './pokemon.service';
import { PokemonCard } from './pokemon-card';

/** Colores oficiales por tipo para las insignias del detalle. */
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  stellar: '#E0CC72',
};

@Component({
  imports: [PokemonCard],
  selector: 'app-pokedex',
  styleUrl: './pokedex.css',
  templateUrl: './pokedex.html',
})
export class Pokedex {
  private readonly service = inject(PokemonService);

  protected readonly query = signal('');
  protected readonly selectedType = signal<string | null>(null);
  protected readonly pokemon = signal<PokemonListItem[]>([]);
  protected readonly types = signal<PokemonTypeItem[]>([]);
  protected readonly typeFiltered = signal<PokemonListItem[] | null>(null);
  protected readonly detail = signal<Pokemon | null>(null);
  protected readonly detailLoading = signal(false);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  /** Resultados visibles: lista por tipo (si hay) filtrada por texto. */
  protected readonly filtered = computed(() => {
    const base = this.typeFiltered() ?? this.pokemon();
    const q = this.query().trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => p.name.includes(q) || String(p.id) === q);
  });

  constructor() {
    this.service.getPokemonList().subscribe({
      next: (list) => {
        this.pokemon.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
    this.service.getTypes().subscribe({
      next: (list) => this.types.set(list),
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const type = value === '' ? null : value;
    this.selectedType.set(type);
    if (type === null) {
      this.typeFiltered.set(null);
      return;
    }
    this.service.getPokemonByType(type).subscribe({
      next: (list) => {
        if (this.selectedType() === type) this.typeFiltered.set(list);
      },
      error: () => {
        if (this.selectedType() === type) this.typeFiltered.set([]);
      },
    });
  }

  protected openDetail(item: PokemonListItem): void {
    this.detailLoading.set(true);
    this.detail.set(null);
    this.service.getPokemon(item.id).subscribe({
      next: (pokemon) => {
        this.detail.set(pokemon);
        this.detailLoading.set(false);
      },
      error: () => this.detailLoading.set(false),
    });
  }

  protected closeDetail(): void {
    this.detail.set(null);
  }

  protected spriteUrl(id: number): string {
    return this.service.spriteUrl(id);
  }

  protected typeColor(name: string): string {
    return TYPE_COLORS[name] ?? '#777';
  }
}
