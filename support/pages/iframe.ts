import { Page, FrameLocator, Locator, expect } from "@playwright/test";

export default class IframeUtils {

    protected page: Page;
    protected frameLocator: FrameLocator;
    protected iframeSelector: string;

    /**CODEOWNER NOTES
     * This constructor allows us to extend the class to - say a new page where for some reason iframe id and selector is different
     * @param page 
     * @param iframeSelector 
     */
    constructor(page: Page, iframeSelector: string = '#framelive') {
        this.page = page;
        this.iframeSelector = iframeSelector;
        this.frameLocator = page.frameLocator(this.iframeSelector);
    }

    /**
     * Wait for iframe to be visible and fully loaded
     */
    async waitForIframeLoad(): Promise<void> {
        await this.page.waitForSelector(this.iframeSelector, { state: 'attached', timeout: 30_000 });
        await expect(this.page.locator(this.iframeSelector)).toBeVisible({ timeout: 30_000 });

        const frameElementHandle = await this.page.locator(this.iframeSelector).elementHandle();
        const frame = await frameElementHandle?.contentFrame();

        if (!frame) throw new Error(`Iframe with selector ${this.iframeSelector} not found or failed to load`);
        await frame.waitForLoadState('load');
    }

    getIframeElement(selector: Locator): Locator {
        return this.frameLocator.locator(selector);
    }

    async clickButtonInIframe(selector: Locator): Promise<void> {
        const element = this.getIframeElement(selector)
        await element.waitFor({ state: 'visible', timeout: 10_000 });
        await element.click();
    }

    async fillInIframe(selector: Locator, text: string): Promise<void> {
        await this.getIframeElement(selector).fill(text);
    }

    async getTextInIframe(selector: Locator): Promise<string> {
        return await this.getIframeElement(selector).textContent() ?? '';
    }

    async assertSectionText(selector: Locator, expectedText: string): Promise<void> {
        const element = this.getIframeElement(selector);
        await expect(element).toBeVisible({ timeout: 30_000 });
        await expect(element).toContainText(expectedText, { timeout: 10_000 });
    }

    async clickProductTile(selector: Locator): Promise<void> {
        const element = this.getIframeElement(selector);
        await element.click();
        await this.page.waitForLoadState('load', { timeout: 10_000 });
    }

    async waitForSelector(selector: Locator): Promise<void> {
        const element = this.getIframeElement(selector);
        await element.waitFor({state: 'visible', timeout: 10_000})
    }

    async extractUIText(selector: Locator): Promise<string>{
        const element = this.getIframeElement(selector);
        const uiText = await element.textContent() || '';
        return uiText;
    }

    async extractFloatValue(selector: Locator): Promise<number> {
        const element = this.getIframeElement(selector);
        const uiNumber = await element.getAttribute('content');
        return parseFloat(uiNumber || '0');
      }

      async extractAttribute(selector: Locator, attr: string): Promise<string> {
        const element = this.getIframeElement(selector).getAttribute(attr);
        const thisValue = await element || '';
        return thisValue;
      }
      
      async assertButtonIsDisabled(selector: Locator): Promise<void> {
        const element = this.getIframeElement(selector);
        await element.waitFor({ state: 'visible', timeout: 10_000 });
        expect(element).toBeDisabled;
      }

}
