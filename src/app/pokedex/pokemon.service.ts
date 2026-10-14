import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Pokemon, PokemonListItem, PokemonTypeItem } from './pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

/** Forma cruda de los recursos con nombre de PokeAPI. */
interface ApiResource {
  name: string;
  url: string;
}

/** Extrae el id numérico de una URL tipo `https://pokeapi.co/api/v2/pokemon/25/`. */
function idFromUrl(url: string): number {
  const segments = url.split('/').filter(Boolean);
  return Number(segments[segments.length - 1]);
}

@Service()
export class PokemonService {
  private readonly http = inject(HttpClient);

  /**
   * Las peticiones se cachean en campos (no por llamada): `shareReplay` por
   * sí solo solo cachéa dentro de cada observable, y aquí se creaba uno nuevo
   * en cada invocación. Así repetir búsquedas o reabrir un detalle no vuelve
   * a la red.
   */
  private readonly list$ = this.http
    .get<{ results: ApiResource[] }>(`${API_BASE}/pokemon?limit=1025`)
    .pipe(
      map(({ results }) => results.map((r) => ({ id: idFromUrl(r.url), name: r.name }))),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

  private readonly types$ = this.http.get<{ results: ApiResource[] }>(`${API_BASE}/type`).pipe(
    map(({ results }) =>
      results
        .filter((r) => r.name !== 'unknown' && r.name !== 'shadow')
        .map((r) => ({ id: idFromUrl(r.url), name: r.name })),
    ),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  private readonly byType = new Map<string, Observable<PokemonListItem[]>>();
  private readonly details = new Map<string | number, Observable<Pokemon>>();

  /** Lista completa (1025 Pokémon) en una sola petición, cacheada. */
  getPokemonList(): Observable<PokemonListItem[]> {
    return this.list$;
  }

  /** Tipos disponibles, excluyendo los no jugables `unknown` y `shadow`. */
  getTypes(): Observable<PokemonTypeItem[]> {
    return this.types$;
  }

  /** Lista de Pokémon de un tipo concreto, cacheada por tipo. */
  getPokemonByType(typeName: string): Observable<PokemonListItem[]> {
    let cached = this.byType.get(typeName);
    if (!cached) {
      cached = this.http
        .get<{ pokemon: { pokemon: ApiResource }[] }>(`${API_BASE}/type/${typeName}`)
        .pipe(
          map(({ pokemon }) =>
            pokemon.map((p) => ({
              id: idFromUrl(p.pokemon.url),
              name: p.pokemon.name,
            })),
          ),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
      this.byType.set(typeName, cached);
    }
    return cached;
  }

  /** Detalle de un Pokémon, cacheado por id/nombre. */
  getPokemon(idOrName: number | string): Observable<Pokemon> {
    let cached = this.details.get(idOrName);
    if (!cached) {
      cached = this.http
        .get<Pokemon>(`${API_BASE}/pokemon/${idOrName}`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
      this.details.set(idOrName, cached);
    }
    return cached;
  }

  /** URL del artwork oficial derivada del id → sin peticiones extra en el grid. */
  spriteUrl(id: number): string {
    return (
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/' +
      `pokemon/other/official-artwork/${id}.png`
    );
  }
}
