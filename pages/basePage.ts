import { Page } from '@playwright/test';

export class BasePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

}