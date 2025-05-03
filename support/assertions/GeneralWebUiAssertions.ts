import { expect, Page } from "playwright/test";

/**CODEOWNER NOTES
 * In the principle of maintaining 'DRY' principle in coding, I would like to maintain all reusable assertions
 *    for web UI in this class. 
 * Note: Expanding the coverage for more complex  UIs and pages, we can extend this class to support say mobile/device testing, etc.
 */
export default class GeneralWebUiAssertions {
  constructor(private page: Page) {}

  private Elements = {};

  async assertLandingHomepage(url: string): Promise<void> {
    try {
      await expect(this.page).toHaveURL(url);
      console.log(`✅ [Healthcheck] Webpage is accessible!`);
    } catch (error) {
      console.error(`❌ [Healthcheck] Webpage is not accessible for now :(`);
      throw error;
    }
  }

  async assertUrl(url: string): Promise<void> {
    try {
      await expect(this.page).toHaveURL(url);
      console.log(`✅ [Pass] URL matched: ${url}`);
    } catch (error) {
      console.error(
        `❌ [Fail] URL did not match. Expected: ${url}, but got: ${this.page.url()}`,
      );
      throw error;
    }
  }

  async assertPromptModal(text: string): Promise<void> {}

  async assertPageTitle(title: string): Promise<void> {
    const pageTitle = await this.page.title();
    expect(pageTitle).toContain(title);
  }
}
