
import ingredientsReducer from './ingredientsSlice';
import type { TIngredient } from '../../utils/types';

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  test('должен возвращать начальное состояние', () => {
    const state = ingredientsReducer(undefined, {
      type: 'unknown'
    });

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  test('должен включать загрузку при pending', () => {
    const state = ingredientsReducer(undefined, {
      type: 'ingredients/fetchIngredients/pending'
    });

    expect(state.isLoading).toBe(true);
  });

  test('должен сохранять ингредиенты при fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '123',
        name: 'Тестовая булочка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 100,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png'
      }
    ];

    const state = ingredientsReducer(undefined, {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: ingredients
    });

    expect(state.items).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('должен сохранять ошибку при rejected', () => {
    const state = ingredientsReducer(undefined, {
      type: 'ingredients/fetchIngredients/rejected',
      error: {
        message: 'Ошибка загрузки ингредиентов'
      }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
