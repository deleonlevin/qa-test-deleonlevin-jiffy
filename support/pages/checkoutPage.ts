import { Page, expect } from '@playwright/test';
import { ProductDetails, CartProducts } from './productPage';
import IframeUtils from './iframe';
import GeneralWebUtilities from '../assertions/GeneralWebUtilities';

let UiUtilities: GeneralWebUtilities;

export default class CheckoutPage extends IframeUtils {
    constructor(page: Page) {
        super(page);
        UiUtilities = new GeneralWebUtilities(page);
    }

    /**
     * Page Locators
     *    Rule of thumb: As much as possible use locators for Elements instead of class/xpath strings
     */
    private readonly Elements = {
        pageTitle: this.page.getByRole('heading', { name: /Personal Information/ }),
        checkoutPageTotalPrice: this.page.locator('#cart-subtotal-products .value')


    }

    async waitForRedirect(): Promise<void> {
        await this.assertSectionText(this.Elements.pageTitle, 'Personal Information');
    }

    private async checkTotalPrice(): Promise<number> {
        const subtotal = await this.extractUIText(this.Elements.checkoutPageTotalPrice);
        return parseFloat(subtotal.replace(/[^\d.]/g, '')) || 0         
    }

    async assertCheckoutPagePriceBreakdown(productSourceOfTruth: ProductDetails | CartProducts): Promise<void> {
        const actualTotalPrice = await this.checkTotalPrice();
        let expectedTotalPrice = 0;
        if (Array.isArray(productSourceOfTruth)) {
            productSourceOfTruth.forEach(item => {
                expectedTotalPrice = expectedTotalPrice +
                     (item.productQuantity * item.productUnitPrice);
                
            });
            expectedTotalPrice = parseFloat(expectedTotalPrice.toFixed(2))
        } else {
            expectedTotalPrice = productSourceOfTruth.productQuantity * productSourceOfTruth.productUnitPrice
        }
        console.log(`[Test] Expected Total: ${expectedTotalPrice}`);
        console.log(`[Test] Actual Total: ${actualTotalPrice}`);
        expect(actualTotalPrice).toStrictEqual(expectedTotalPrice);
        
    }
}