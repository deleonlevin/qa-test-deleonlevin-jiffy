# Test info

- Name: [AC2] The user can place an order from the cart. >> [AC2_03] Checkout - No product in cart
- Location: /Users/levindeleon/Desktop/playwright-playground/qa-test-deleonlevin-jiffy/tests/regression/checkout.spec.ts:106:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#framelive').contentFrame().getByRole('link', { name: 'Proceed to checkout' }) to be visible

    at Shoppingcartpage.assertButtonIsDisabled (/Users/levindeleon/Desktop/playwright-playground/qa-test-deleonlevin-jiffy/support/pages/iframe.ts:89:23)
    at Shoppingcartpage.removeProductFromCart (/Users/levindeleon/Desktop/playwright-playground/qa-test-deleonlevin-jiffy/support/pages/shoppingcartPage.ts:113:20)
    at /Users/levindeleon/Desktop/playwright-playground/qa-test-deleonlevin-jiffy/tests/regression/checkout.spec.ts:128:5
```

# Test source

```ts
   1 | import { Page, FrameLocator, Locator, expect } from "@playwright/test";
   2 |
   3 | export default class IframeUtils {
   4 |
   5 |     protected page: Page;
   6 |     protected frameLocator: FrameLocator;
   7 |     protected iframeSelector: string;
   8 |
   9 |     /**CODEOWNER NOTES
  10 |      * This constructor allows us to extend the class to - say a new page where for some reason iframe id and selector is different
  11 |      * @param page 
  12 |      * @param iframeSelector 
  13 |      */
  14 |     constructor(page: Page, iframeSelector: string = '#framelive') {
  15 |         this.page = page;
  16 |         this.iframeSelector = iframeSelector;
  17 |         this.frameLocator = page.frameLocator(this.iframeSelector);
  18 |     }
  19 |
  20 |     /**
  21 |      * Wait for iframe to be visible and fully loaded
  22 |      */
  23 |     async waitForIframeLoad(): Promise<void> {
  24 |         await this.page.waitForSelector(this.iframeSelector, { state: 'attached', timeout: 30_000 });
  25 |         await expect(this.page.locator(this.iframeSelector)).toBeVisible({ timeout: 30_000 });
  26 |
  27 |         const frameElementHandle = await this.page.locator(this.iframeSelector).elementHandle();
  28 |         const frame = await frameElementHandle?.contentFrame();
  29 |
  30 |         if (!frame) throw new Error(`Iframe with selector ${this.iframeSelector} not found or failed to load`);
  31 |         await frame.waitForLoadState('load');
  32 |     }
  33 |
  34 |     getIframeElement(selector: Locator): Locator {
  35 |         return this.frameLocator.locator(selector);
  36 |     }
  37 |
  38 |     async clickButtonInIframe(selector: Locator): Promise<void> {
  39 |         const element = this.getIframeElement(selector)
  40 |         await element.waitFor({ state: 'visible', timeout: 10_000 });
  41 |         await element.click();
  42 |     }
  43 |
  44 |     async fillInIframe(selector: Locator, text: string): Promise<void> {
  45 |         await this.getIframeElement(selector).fill(text);
  46 |     }
  47 |
  48 |     async getTextInIframe(selector: Locator): Promise<string> {
  49 |         return await this.getIframeElement(selector).textContent() ?? '';
  50 |     }
  51 |
  52 |     async assertSectionText(selector: Locator, expectedText: string): Promise<void> {
  53 |         const element = this.getIframeElement(selector);
  54 |         await expect(element).toBeVisible({ timeout: 30_000 });
  55 |         await expect(element).toContainText(expectedText, { timeout: 10_000 });
  56 |     }
  57 |
  58 |     async clickProductTile(selector: Locator): Promise<void> {
  59 |         const element = this.getIframeElement(selector);
  60 |         await element.click();
  61 |         await this.page.waitForLoadState('load', { timeout: 10_000 });
  62 |     }
  63 |
  64 |     async waitForSelector(selector: Locator): Promise<void> {
  65 |         const element = this.getIframeElement(selector);
  66 |         await element.waitFor({state: 'visible', timeout: 10_000})
  67 |     }
  68 |
  69 |     async extractUIText(selector: Locator): Promise<string>{
  70 |         const element = this.getIframeElement(selector);
  71 |         const uiText = await element.textContent() || '';
  72 |         return uiText;
  73 |     }
  74 |
  75 |     async extractFloatValue(selector: Locator): Promise<number> {
  76 |         const element = this.getIframeElement(selector);
  77 |         const uiNumber = await element.getAttribute('content');
  78 |         return parseFloat(uiNumber || '0');
  79 |       }
  80 |
  81 |       async extractAttribute(selector: Locator, attr: string): Promise<string> {
  82 |         const element = this.getIframeElement(selector).getAttribute(attr);
  83 |         const thisValue = await element || '';
  84 |         return thisValue;
  85 |       }
  86 |       
  87 |       async assertButtonIsDisabled(selector: Locator): Promise<void> {
  88 |         const element = this.getIframeElement(selector);
> 89 |         await element.waitFor({ state: 'visible', timeout: 10_000 });
     |                       ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  90 |         expect(element).toBeDisabled;
  91 |       }
  92 |
  93 | }
  94 |
```