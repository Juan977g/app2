import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // La Pokédex depende de PokeAPI en runtime: se renderiza en el navegador
    // para que `ng build` no llame a la API ni congele datos caducados.
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
