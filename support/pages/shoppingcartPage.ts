import { Page, expect } from '@playwright/test';
import { ProductDetails, CartProducts } from './productPage';
import IframeUtils from './iframe';
import GeneralWebUtilities from '../assertions/GeneralWebUtilities';

let UiUtilities: GeneralWebUtilities;

export default class Shoppingcartpage extends IframeUtils {
    constructor(page: Page) {
        super(page);
        UiUtilities = new GeneralWebUtilities(page);
    }

    /**
     * Page Locators
     *    Rule of thumb: As much as possible use locators for Elements instead of class/xpath strings
     */
    private readonly Elements = {
        pageTitle: this.page.getByRole('heading', { name: /Shopping Cart/ }),
        checkoutCart: this.page.locator('.cart-items > .cart-item'),
        checkoutProductName: this.page.locator('.product-line-info a.label'),
        checkoutProductQuantity: this.page.locator('input.js-cart-line-product-quantity'),
        checkoutProductPrice: this.page.locator('.product-price strong'),
        proceedToCheckoutButton: this.page.getByRole('link', { name: 'Proceed to checkout' })
    }

    async waitForRedirect(): Promise<void> {
        await this.page.waitForLoadState();
        await this.waitForSelector(this.Elements.pageTitle);
        await this.assertSectionText(this.Elements.pageTitle, 'Shopping Cart');
    }

    async proceedToCheckout(): Promise<void> {
        await this.clickButtonInIframe(this.Elements.proceedToCheckoutButton);
        await this.page.waitForLoadState();
    }

    async assertShoppingCartProductDetails(productSourceOfTruth: ProductDetails | CartProducts): Promise<void> {
        if (Array.isArray(productSourceOfTruth)) {
            const actualDetails: ProductDetails[] = [];
            const count = productSourceOfTruth.length;

            for(let i = 0; i < productSourceOfTruth.length; i++){

            
                const checkoutProductName = await this.extractUIText(this.Elements.checkoutProductName.nth(i));
                const checkoutProductQuantity = await this.extractAttribute(this.Elements.checkoutProductQuantity.nth(i), 'value');
                const checkoutProductPrice = await this.extractUIText(this.Elements.checkoutProductPrice.nth(i));
    
                const checkoutProductSizeVariation = productSourceOfTruth[i]?.productVariation?.size;
                const checkoutProductColorVariation = productSourceOfTruth[i]?.productVariation?.color;
                const checkoutProductDimensionVariation = productSourceOfTruth[i]?.productVariation?.dimension;
    
                let checkoutProductVariation = {
                    ...(checkoutProductSizeVariation && { size: checkoutProductSizeVariation }),
                    ...(checkoutProductColorVariation && { size: checkoutProductColorVariation }),
                    ...(checkoutProductDimensionVariation && { size: checkoutProductDimensionVariation })
                }

                actualDetails.push({
                        productName: checkoutProductName,
                        productQuantity:  parseInt(checkoutProductQuantity.replace(/\D/g, '')) || 0,
                        productUnitPrice: parseFloat(
                            parseFloat(checkoutProductPrice.replace(/[^\d.]/g, '')).toFixed(2)
                            ) || 0.00,
                        productVariation: checkoutProductVariation || {}
                        
                    });                   
                
            }
            console.log(`[Log] Extracted from UI: ${JSON.stringify(actualDetails)}`);
            await UiUtilities.deepEquality(productSourceOfTruth, actualDetails);
        } else {
            // Single product checkout flow
            const checkoutProductName = await this.extractUIText(this.Elements.checkoutProductName);
            const checkoutProductQuantity = await this.extractAttribute(this.Elements.checkoutProductQuantity, 'value');
            const checkoutProductPrice = await this.extractUIText(this.Elements.checkoutProductPrice);

            const checkoutProductSizeVariation = productSourceOfTruth?.productVariation?.size;
            const checkoutProductColorVariation = productSourceOfTruth?.productVariation?.color;
            const checkoutProductDimensionVariation = productSourceOfTruth?.productVariation?.dimension;

            let checkoutProductVariation = {
                ...(checkoutProductSizeVariation && { size: checkoutProductSizeVariation }),
                ...(checkoutProductColorVariation && { size: checkoutProductColorVariation }),
                ...(checkoutProductDimensionVariation && { size: checkoutProductDimensionVariation }),
            }

            const actualDetails: ProductDetails = {
                productName: checkoutProductName || '',
                productQuantity: parseInt(checkoutProductQuantity.replace(/\D/g, '')) || 0,
                productUnitPrice: parseFloat(
                    parseFloat(checkoutProductPrice.replace(/[^\d.]/g, '')).toFixed(2)
                  ) || 0.00,
                
                productVariation: checkoutProductVariation || {}
            }
            console.log(`[Log] Extracted from UI: ${JSON.stringify(actualDetails)}`);
            await UiUtilities.deepEquality(productSourceOfTruth, actualDetails)
        }
    }
}