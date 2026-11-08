import ingredientsReducer from './ingredientsSlice';

import type { TIngredient } from '../../utils/types';

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
}));

describe('ingredientsSlice', () => {
  test('liefert den Ausgangszustand', () => {
    const state = ingredientsReducer(undefined, {
      type: 'unknown',
    });

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  test('aktiviert den Ladezustand bei pending', () => {
    const state = ingredientsReducer(undefined, {
      type: 'ingredients/fetchIngredients/pending',
    });

    expect(state.isLoading).toBe(true);
  });

  test('speichert Zutaten bei fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '123',
        name: 'Testbrötchen',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 100,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
      },
    ];

    const state = ingredientsReducer(undefined, {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: ingredients,
    });

    expect(state.items).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('speichert Fehler bei rejected', () => {
    const state = ingredientsReducer(undefined, {
      type: 'ingredients/fetchIngredients/rejected',
      error: {
        message: 'Fehler beim Laden der Zutaten',
      },
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Fehler beim Laden der Zutaten');
  });
});
