import { Page } from '@playwright/test';
import IframeUtils from './iframe';
import GeneralWebUtilities from '../assertions/GeneralWebUtilities';

let UiUtilities: GeneralWebUtilities;

export type ProductDetails = {
    productName: string,
    productQuantity: number,
    productUnitPrice: number,
    productVariation?: {
      size?: string | null,
      color?: string | null,
      dimension?: string | null
    }
}

export type CartProducts = ProductDetails[];

export default class Productpage extends IframeUtils {
    
    
    constructor(page: Page) {
        super(page);
        UiUtilities = new GeneralWebUtilities(page)
    }

// Private page locators
    private readonly Elements = {
        producttName: this.page.locator('h1.h1'),
        productCurrentPrice: this.page.locator('.current-price-value'),
        
        popUpModalId: this.page.locator('#blockcart-modal'),
        popUpModal: this.page.locator('h4:has-text("Product successfully added to your shopping cart")'),
        modalProductName: this.page.locator('h6.h6'),
        modalProductUnitPrice: this.page.locator('p.product-price'),
        modalProductQuantity: this.page.locator('span.product-quantity strong'),
        
        proceedToCheckoutButton: this.page.getByRole('link', { name: /Proceed to checkout/i }),
        continueShoppingButton: this.page.getByRole('button', { name: 'Continue shopping' }),
        addToCartButton: this.page.locator('button[data-button-action="add-to-cart"]'),
        homeButton: this.page.locator('#_desktop_logo').getByRole('link', { name: 'PrestaShop', exact: true }),
        
        productTotal: this.page.locator('.product-total .value')
    }

    async addToCart(): Promise<void> {
        await this.clickButtonInIframe(this.Elements.addToCartButton);
        await this.page.waitForLoadState();      
    }

    async awaitPopupModal(): Promise<void> {
        await this.waitForSelector(this.Elements.popUpModalId)
    }

    async proceedToCheckout(): Promise<void> {
        await this.clickButtonInIframe(this.Elements.proceedToCheckoutButton);
        await this.page.waitForLoadState();
    }

    async continueShopping(): Promise<void> {
        await this.clickButtonInIframe(this.Elements.continueShoppingButton);
        await this.page.waitForLoadState();
    }

    async goBackToHome(): Promise<void> {
        await this.clickButtonInIframe(this.Elements.homeButton);
        await this.page.waitForLoadState();
    }

    async extractProductName(): Promise<string>{
        let productName = await this.extractUIText(this.Elements.producttName);
        return UiUtilities.cleanText(productName);
    }

    async extractProductCurrentPrice(): Promise<number> {
        let productPrice = await this.extractFloatValue(this.Elements.productCurrentPrice);
        return productPrice;
    }
    
    /**
     * ASSERTIONS
     */
    async assertModalProductDetails(productSourceOfTruth: ProductDetails): Promise<void>{
        const modalProductName = await this.extractUIText(this.Elements.modalProductName);
        const modalProductQuanity = await this.extractUIText(this.Elements.modalProductQuantity);
        const modalProductUnitPrice = await this.extractUIText(this.Elements.modalProductUnitPrice);

        const modalProductSizeVariation = productSourceOfTruth?.productVariation?.size;
        const modalProductColorVariation = productSourceOfTruth?.productVariation?.color;
        const modalProductDimensionVariation = productSourceOfTruth?.productVariation?.dimension;

        let modalProductVariation = {
            ...(modalProductColorVariation && {color: modalProductColorVariation}),
            ...(modalProductSizeVariation && {size: modalProductSizeVariation}),
            ...(modalProductDimensionVariation && {dimension: modalProductDimensionVariation}),
        };

        let modalProductDetails:  ProductDetails = {
            productName: modalProductName || '',
            productQuantity: parseInt(modalProductQuanity.replace(/\D/g, '')) || 0,
            productUnitPrice: parseFloat(modalProductUnitPrice.replace(/[^\d.]/g, '')) || 0,            
            productVariation: modalProductVariation || {}

        }

        await UiUtilities.deepEquality(productSourceOfTruth, modalProductDetails)

    }

}