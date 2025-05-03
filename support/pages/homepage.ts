import { Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage {
  constructor(private page: Page) { }

  private readonly Elements = {
    
  }

  async assertPageTitle(): Promise<void> { }
}
