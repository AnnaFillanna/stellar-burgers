
import { test, expect } from '@playwright/test';

test('должен открывать главную страницу', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL('http://localhost:4000/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
});


test('должен загружать моковые ингредиенты', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort'
  });

  await page.goto('/');

  await expect(
    page.getByText('Тестовая булочка')
  ).toBeVisible();

  await expect(
    page.getByText('Тестовая котлета')
  ).toBeVisible();
});


test('должен добавлять булочку в конструктор', async ({ page }) => {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      path: 'tests/fixtures/ingredients.json'
    });
  });

  await page.goto('/');

  const bunCard = page.locator('li').filter({
    hasText: 'Тестовая булочка'
  });

  await bunCard.getByText('Добавить').click();

await expect(
  page.getByText('Тестовая булочка')
).toHaveCount(3);
});
test('должен добавлять начинку в конструктор', async ({ page }) => {
await page.routeFromHAR('tests/hars/ingredients.har', {
  url: '**/api/ingredients',
  update: false,
  notFound: 'abort'
});

  await page.goto('/');

  const cutletCard = page.locator('li').filter({
    hasText: 'Тестовая котлета'
  });

  await cutletCard.getByText('Добавить').click();

  await expect(
    page.getByText('Тестовая котлета')
  ).toHaveCount(2);
});
test('должен открывать и закрывать модальное окно ингредиента', async ({
  page
}) => {
await page.routeFromHAR('tests/hars/ingredients.har', {
  url: '**/api/ingredients',
  update: false,
  notFound: 'abort'
});

  await page.goto('/');

  // Открываем карточку булочки
  await page.getByText('Тестовая булочка').click();

  // Проверяем, что появилось модальное окно
  await expect(
    page.getByRole('heading', { name: 'Детали ингредиента' })
  ).toBeVisible();

  // Закрываем окно
  await page.getByRole('button', { name: 'Закрыть' }).click();

  // Проверяем, что окно исчезло
  await expect(
    page.getByRole('heading', { name: 'Детали ингредиента' })
  ).not.toBeVisible();
});
test('должен закрывать модальное окно по overlay', async ({ page }) => {
await page.routeFromHAR('tests/hars/ingredients.har', {
  url: '**/api/ingredients',
  update: false,
  notFound: 'abort'
});

  await page.goto('/');

  // Открываем модальное окно
  await page.getByText('Тестовая булочка').click();

  // Проверяем, что окно открылось
  await expect(
    page.getByRole('heading', { name: 'Детали ингредиента' })
  ).toBeVisible();

  // Нажимаем на затемнённый фон
  await page.locator('[class*="overlay"]').click({
    position: { x: 5, y: 5 }
  });


  // Проверяем, что окно закрылось
  await expect(
    page.getByRole('heading', { name: 'Детали ингредиента' })
  ).not.toBeVisible();
});
test('должен оформлять заказ авторизованного пользователя', async ({
  page
}) => {
  // Создаём тестовый токен авторизации
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-token',
      url: 'http://localhost:4000'
    }
  ]);

  // Подменяем ответ сервера с данными пользователя
  await page.route('**/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      path: 'tests/fixtures/user.json'
    });
  });

  // Подменяем список ингредиентов
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      path: 'tests/fixtures/ingredients.json'
    });
  });
// Подменяем ответ сервера при оформлении заказа
await page.routeFromHAR('tests/hars/order.har', {
  url: '**/api/orders',
  update: false,
  notFound: 'abort'
});
await page.goto('/');

// Проверяем, что ингредиенты загрузились
await expect(page.getByText('Тестовая булочка')).toBeVisible();

  // Проверяем, что ингредиенты загрузились
  await expect(page.getByText('Тестовая булочка')).toBeVisible();
  // Добавляем булочку
const bunCard = page.locator('li').filter({
  hasText: 'Тестовая булочка'
});

await bunCard.getByText('Добавить').click();

// Добавляем котлету
const cutletCard = page.locator('li').filter({
  hasText: 'Тестовая котлета'
});
// Добавляем котлету
await cutletCard.getByText('Добавить').click();

// Проверяем, что ингредиенты появились в конструкторе
await expect(page.getByText('Тестовая булочка')).toHaveCount(3);
await expect(page.getByText('Тестовая котлета')).toHaveCount(2);

// Оформляем заказ
await page.getByRole('button', { name: 'Оформить заказ' }).click();
// Проверяем номер оформленного заказа
await expect(
  page.getByRole('heading', { name: '12345' })
).toBeVisible();



// Закрываем модальное окно заказа
await page.getByRole('button', { name: 'Закрыть' }).click();

// Проверяем, что номер заказа исчез
await expect(
  page.getByRole('heading', { name: '12345' })
).not.toBeVisible();

// Проверяем, что конструктор очистился
await expect(page.getByText('Тестовая булочка')).toHaveCount(1);
await expect(page.getByText('Тестовая котлета')).toHaveCount(1);
});

