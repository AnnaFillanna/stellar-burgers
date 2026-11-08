import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });
});

test('öffnet die Startseite', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL('http://localhost:4000/');
  await expect(
    page.getByRole('heading', { name: 'Stelle deinen Burger zusammen' })
  ).toBeVisible();
});

test('lädt Zutaten aus dem HAR-Archiv', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });

  await page.goto('/');

  await expect(page.getByText('Testbrötchen')).toBeVisible();

  await expect(page.getByText('Testpatty')).toBeVisible();
});

test('fügt ein Brötchen zum Burger hinzu', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });

  await page.goto('/');

  const bunCard = page.locator('li').filter({
    hasText: 'Testbrötchen',
  });

  await bunCard.getByText('Hinzufügen').click();

  await expect(page.getByText('Testbrötchen')).toHaveCount(3);
});
test('fügt einen Belag zum Burger hinzu', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });

  await page.goto('/');

  const cutletCard = page.locator('li').filter({
    hasText: 'Testpatty',
  });

  await cutletCard.getByText('Hinzufügen').click();

  await expect(page.getByText('Testpatty')).toHaveCount(2);
});
test('öffnet und schließt die Zutatendetails', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });

  await page.goto('/');

  await page.getByText('Testbrötchen').click();

  await expect(page.getByRole('heading', { name: 'Zutatendetails' })).toBeVisible();
  await expect(
    page.locator('#modals').getByText('Testbrötchen', { exact: true })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Schließen' }).click();

  await expect(page.getByRole('heading', { name: 'Zutatendetails' })).not.toBeVisible();
});
test('schließt den Dialog über den Hintergrund', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });

  await page.goto('/');

  await page.getByText('Testbrötchen').click();

  await expect(page.getByRole('heading', { name: 'Zutatendetails' })).toBeVisible();

  await page.locator('[class*="overlay"]').click({
    position: { x: 5, y: 5 },
  });

  await expect(page.getByRole('heading', { name: 'Zutatendetails' })).not.toBeVisible();
});
test('bestellt als angemeldete Person', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'test-access-token',
      url: 'http://localhost:4000',
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/auth/user',
    update: false,
    notFound: 'abort',
  });

  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });

  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders',
    update: false,
    notFound: 'abort',
  });
  await page.goto('/');

  await expect(page.getByText('Testbrötchen')).toBeVisible();

  await expect(page.getByText('Testbrötchen')).toBeVisible();

  const bunCard = page.locator('li').filter({
    hasText: 'Testbrötchen',
  });

  await bunCard.getByText('Hinzufügen').click();

  const cutletCard = page.locator('li').filter({
    hasText: 'Testpatty',
  });

  await cutletCard.getByText('Hinzufügen').click();

  await expect(page.getByText('Testbrötchen')).toHaveCount(3);
  await expect(page.getByText('Testpatty')).toHaveCount(2);

  const orderRequest = page.waitForRequest(
    (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
  );
  await page.getByRole('button', { name: 'Jetzt bestellen' }).click();
  expect((await orderRequest).headers().authorization).toBe('test-access-token');
  expect(await page.evaluate(() => localStorage.getItem('refreshToken'))).toBe(
    'test-refresh-token'
  );

  await expect(page.getByRole('heading', { name: '12345' })).toBeVisible();

  await page.getByRole('button', { name: 'Schließen' }).click();

  await expect(page.getByRole('heading', { name: '12345' })).not.toBeVisible();

  await expect(page.getByText('Testbrötchen')).toHaveCount(1);
  await expect(page.getByText('Testpatty')).toHaveCount(1);
});
