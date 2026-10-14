/** Ítem resumido de la lista de Pokédex (id derivado de la URL del recurso). */
export interface PokemonListItem {
  id: number;
  name: string;
}

/** Tipo de Pokémon (nombre + URL del recurso, p. ej. /type/10/ = fire). */
export interface PokemonTypeItem {
  id: number;
  name: string;
}

/** Detalle completo de un Pokémon (respuesta de GET /pokemon/{id|name}). */
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: PokemonTypeItem }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { other?: { ['official-artwork']?: { front_default: string | null } } };
}
