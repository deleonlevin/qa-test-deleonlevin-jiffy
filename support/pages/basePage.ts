import { Page } from "@playwright/test";

export class BasePage {
  constructor(private page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }
}
