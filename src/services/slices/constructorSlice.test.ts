import constructorReducer from './constructorSlice';

jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
}));

describe('constructorSlice', () => {
  test('liefert den Ausgangszustand', () => {
    const state = constructorReducer(undefined, {
      type: 'unknown',
    });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('fügt ein Brötchen zum Burger hinzu', () => {
    const bun = {
      _id: '123',
      id: 'test-id',
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
    };

    const state = constructorReducer(undefined, {
      type: 'burgerConstructor/addIngredient',
      payload: bun,
    });

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  test('fügt einen Belag zum Burger hinzu', () => {
    const ingredient = {
      _id: '456',
      id: 'test-id-2',
      name: 'Testpatty',
      type: 'main',
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      calories: 250,
      price: 200,
      image: 'cutlet.png',
      image_mobile: 'cutlet-mobile.png',
      image_large: 'cutlet-large.png',
    };

    const state = constructorReducer(undefined, {
      type: 'burgerConstructor/addIngredient',
      payload: ingredient,
    });

    expect(state.ingredients).toEqual([ingredient]);
    expect(state.bun).toBeNull();
  });

  test('entfernt eine Zutat anhand ihrer ID', () => {
    const firstIngredient = {
      _id: '123',
      id: 'first-id',
      name: 'Erstes Patty',
      type: 'main',
      proteins: 20,
      fat: 10,
      carbohydrates: 5,
      calories: 200,
      price: 100,
      image: 'first.png',
      image_mobile: 'first-mobile.png',
      image_large: 'first-large.png',
    };

    const secondIngredient = {
      ...firstIngredient,
      _id: '456',
      id: 'second-id',
      name: 'Zweites Patty',
    };

    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = constructorReducer(initialState, {
      type: 'burgerConstructor/removeIngredient',
      payload: 'first-id',
    });

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  test('ändert die Reihenfolge der Zutaten', () => {
    const firstIngredient = {
      _id: '123',
      id: 'first-id',
      name: 'Patty',
      type: 'main',
      proteins: 20,
      fat: 10,
      carbohydrates: 5,
      calories: 200,
      price: 100,
      image: 'first.png',
      image_mobile: 'first-mobile.png',
      image_large: 'first-large.png',
    };

    const secondIngredient = {
      ...firstIngredient,
      _id: '456',
      id: 'second-id',
      name: 'Käse',
    };

    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = constructorReducer(initialState, {
      type: 'burgerConstructor/moveIngredient',
      payload: { from: 0, to: 1 },
    });

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  test('leert den Burger', () => {
    const ingredient = {
      _id: '123',
      id: 'test-id',
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
    };

    const initialState = {
      bun: ingredient,
      ingredients: [
        {
          ...ingredient,
          id: 'second-id',
          type: 'main',
          name: 'Patty',
        },
      ],
    };

    const state = constructorReducer(initialState, {
      type: 'burgerConstructor/clearConstructor',
    });

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('leert den Burger nach erfolgreicher Bestellung', () => {
    const ingredient = {
      _id: '123',
      id: 'test-id',
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
    };

    const initialState = {
      bun: ingredient,
      ingredients: [
        {
          ...ingredient,
          id: 'second-id',
          type: 'main',
          name: 'Patty',
        },
      ],
    };

    const state = constructorReducer(initialState, {
      type: 'order/createOrder/fulfilled',
    });

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
