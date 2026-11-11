import { describe, expect, it } from 'vitest';
import localeCatalogue from './locale-catalogue.json';

describe('locale catalogue', () => {
  it('contains unique canonical locale codes used by the editor workflows', () => {
    expect(localeCatalogue).toContain('en-CA');
    expect(localeCatalogue).toContain('fr-CA');
    expect(localeCatalogue).toContain('pt-BR');
    expect(new Set(localeCatalogue).size).toBe(localeCatalogue.length);
    expect(localeCatalogue.map((locale) => Intl.getCanonicalLocales(locale)[0])).toEqual(localeCatalogue);
  });
});
