import type { TIngredient } from './types';

// Die API liefert russische Katalognamen; IDs und Bestelldaten bleiben unverändert.
const ingredientNames: Record<string, string> = {
  'Краторная булка N-200i': 'Kraterbrötchen N-200i',
  'Говяжий метеорит (отбивная)': 'Rindfleisch-Meteorit',
  'Биокотлета из марсианской Магнолии': 'Bio-Patty aus Marsmagnolie',
  'Соус фирменный Space Sauce': 'Space Sauce',
  'Соус Spicy-X': 'Spicy-X-Soße',
  'Соус традиционный галактический': 'Traditionelle Galaxiesoße',
  'Флюоресцентная булка R2-D3': 'Fluoreszierendes Brötchen R2-D3',
  'Мясо бессмертных моллюсков Protostomia': 'Fleisch der unsterblichen Protostomia',
  'Филе Люминесцентного тетраодонтимформа': 'Leuchtendes Kugelfischfilet',
  'Соус с шипами Антарианского плоскоходца': 'Antarianische Stachelsoße',
  'Хрустящие минеральные кольца': 'Knusprige Mineralringe',
  'Плоды Фалленианского дерева': 'Früchte des Fallenianischen Baums',
  'Кристаллы марсианских альфа-сахаридов': 'Mars-Alpha-Zuckerkristalle',
  'Мини-салат Экзо-Плантаго': 'Exo-Plantago-Minisalat',
  'Сыр с астероидной плесенью': 'Asteroidenschimmelkäse',
};

export const localizeIngredient = (ingredient: TIngredient): TIngredient => ({
  ...ingredient,
  name: ingredientNames[ingredient.name] ?? ingredient.name,
});

export const getOrderName = (ingredients: TIngredient[]): string => {
  const names = [...new Set(ingredients.map((ingredient) => ingredient.name))];
  return names.length ? `Burger mit ${names.join(', ')}` : 'Weltraum-Burger';
};
