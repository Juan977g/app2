import { Component, inject, input, output } from '@angular/core';
import { PokemonListItem } from './pokemon';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  styleUrl: './pokemon-card.css',
  templateUrl: './pokemon-card.html',
})
export class PokemonCard {
  protected readonly service = inject(PokemonService);

  readonly pokemon = input.required<PokemonListItem>();
  readonly select = output<PokemonListItem>();

  protected get spriteUrl(): string {
    return this.service.spriteUrl(this.pokemon().id);
  }
}
