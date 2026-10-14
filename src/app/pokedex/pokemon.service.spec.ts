import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map the list to id + name, extracting the id from the url', () => {
    let result: { id: number; name: string }[] = [];
    service.getPokemonList().subscribe((r) => (result = r));

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=1025');
    req.flush({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    });

    expect(result).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
    ]);
  });

  it('should exclude the unknown and shadow types', () => {
    let result: { id: number; name: string }[] = [];
    service.getTypes().subscribe((r) => (result = r));

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type');
    req.flush({
      results: [
        { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
        { name: 'shadow', url: 'https://pokeapi.co/api/v2/type/10001/' },
        { name: 'unknown', url: 'https://pokeapi.co/api/v2/type/10002/' },
        { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
      ],
    });

    expect(result.map((t) => t.name)).toEqual(['normal', 'water']);
  });

  it('should map the pokemon of a type from the nested pokemon.pokemon shape', () => {
    let result: { id: number; name: string }[] = [];
    service.getPokemonByType('fire').subscribe((r) => (result = r));

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/fire');
    req.flush({
      pokemon: [
        { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
        { pokemon: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' } },
      ],
    });

    expect(result).toEqual([
      { id: 4, name: 'charmander' },
      { id: 6, name: 'charizard' },
    ]);
  });

  it('should make a single request for repeated list subscriptions (shareReplay)', () => {
    let first: unknown;
    let second: unknown;
    service.getPokemonList().subscribe((r) => (first = r));
    service.getPokemonList().subscribe((r) => (second = r));

    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=1025').flush({ results: [] });

    expect(first).toBe(second);
  });
});
