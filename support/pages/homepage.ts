import { Page } from '@playwright/test';
import IframeUtils from './iframe';

export default class Homepage extends IframeUtils {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Page Locators
     *    Rule of thumb: As much as possible use locators for Elements instead of class/xpath strings
     */
    private readonly Elements = {
      popularProductSectionTest: this.page.getByRole('heading', { name: 'Popular Products' }),
      popularProductSectionFirstProduct: this.page.locator('.product-miniature').first(),
      popularProductSectionLastProduct: this.page.locator('.product-miniature').nth(1)
    }

    async assertPopularProductsSection(): Promise<void> {
        await this.assertSectionText(this.Elements.popularProductSectionTest, 'Popular Products');
    }

    async clickFirstProductInPopularProduct(): Promise<void> {
        await this.clickProductTile(this.Elements.popularProductSectionFirstProduct);
    }

    async clickNewProduct(): Promise<void> {
        await this.clickProductTile(this.Elements.popularProductSectionLastProduct);
    }

}
