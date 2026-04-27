import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await expect(page.getByTestId('splash-screen')).toBeVisible();

    await page.waitForURL('/login');

    await expect(page).toHaveURL(/.*\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // seed session
    await page.evaluate(() => {
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({
          userId: '123',
          email: 'test@test.com',
        })
      );
    });

    await page.goto('/');

    await page.waitForURL('/dashboard');

    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await page.waitForURL('/login');

    await expect(page).toHaveURL(/.*\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('user@test.com');
    await page.getByTestId('auth-signup-password').fill('1234');

    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('/dashboard');

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // seed user + habits
    await page.evaluate(() => {
      localStorage.setItem(
        'habit-tracker-users',
        JSON.stringify([
          {
            id: 'u1',
            email: 'a@test.com',
            password: '1234',
            createdAt: new Date().toISOString(),
          },
        ])
      );

      localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'h1',
            userId: 'u1',
            name: 'Drink Water',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
          {
            id: 'h2',
            userId: 'other',
            name: 'Other Habit',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ])
      );
    });

    await page.goto('/login');

    await page.getByTestId('auth-login-email').fill('a@test.com');
    await page.getByTestId('auth-login-password').fill('1234');

    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('/dashboard');

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId?.('habit-card-other-habit')).toBeHidden();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('create@test.com');
    await page.getByTestId('auth-signup-password').fill('1234');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('create-habit-button').click();

    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('streak@test.com');
    await page.getByTestId('auth-signup-password').fill('1234');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('create-habit-button').click();

    await page.getByTestId('habit-name-input').fill('Exercise');
    await page.getByTestId('habit-save-button').click();

    await page.getByTestId('habit-complete-exercise').click();

    await expect(
      page.getByTestId('habit-streak-exercise')
    ).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('persist@test.com');
    await page.getByTestId('auth-signup-password').fill('1234');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Meditate');
    await page.getByTestId('habit-save-button').click();

    await page.reload();

    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('logout@test.com');
    await page.getByTestId('auth-signup-password').fill('1234');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('auth-logout-button').click();

    await page.waitForURL('/login');

    await expect(page).toHaveURL(/.*\/login/);
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/');

    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        window.location.reload();
      }
    });

    await expect(page.getByTestId('splash-screen')).toBeVisible();

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await context.setOffline(false);
  });
});