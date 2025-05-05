import { test, expect } from "@playwright/test";
import { BasePage } from "../../support/pages/basePage";
import IframeUtils from "../../support/pages/iframe";

import Homepage from "../../support/pages/homepage";
import Productpage, { ProductDetails, CartProducts }from "../../support/pages/productPage";
import Shoppingcartpage from '../../support/pages/shoppingcartPage'
import CheckoutPage from "../../support/pages/checkoutPage";
import GeneralWebUtilities from "../../support/assertions/GeneralWebUtilities";


test.describe("[AC1] The user can add more than one product to the cart.", () => {
  let basePage: BasePage;
  let webUiAssertions: GeneralWebUtilities;
  let iframeUtils: IframeUtils;
  let landingPage: Homepage;
  let productPage: Productpage;
  let shoppingcartPage: Shoppingcartpage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    webUiAssertions = new GeneralWebUtilities(page);
    iframeUtils = new IframeUtils(page);
    landingPage = new Homepage(page);
    productPage = new Productpage(page);
    shoppingcartPage = new Shoppingcartpage(page);
    checkoutPage = new CheckoutPage(page);

    await basePage.goto('/');
    await iframeUtils.waitForIframeLoad();
    await landingPage.assertPopularProductsSection();
  });

  test.afterEach(async ({page})=> {
    await page.close()
  });

  test("[AC1_01] Add a single product to cart", async () => {
    let thisProductDetails: ProductDetails = {
      productName: '',
      productQuantity: 1,
      productUnitPrice: 0,
      productVariation: {}
    };

    await landingPage.clickFirstProductInPopularProduct();
    await iframeUtils.waitForIframeLoad();
    thisProductDetails.productName = await productPage.extractProductName();
    thisProductDetails.productUnitPrice = await productPage.extractProductCurrentPrice();
    
    await productPage.addToCart();
    await productPage.waitForIframeLoad();
    await productPage.awaitPopupModal();
    await productPage.assertModalProductDetails(thisProductDetails); // Test product details on the pop-up modal
    await productPage.proceedToCheckout();
    await productPage.waitForIframeLoad();
    await shoppingcartPage.waitForRedirect();
    await shoppingcartPage.assertShoppingCartProductDetails(thisProductDetails); // Test product details on the Shopping Cart page
    await shoppingcartPage.proceedToCheckout();
    await productPage.waitForIframeLoad();
    await checkoutPage.assertCheckoutPagePriceBreakdown(thisProductDetails) //Test product details on the Checkout page
  });

  test("[AC1_02] Add multiple products to cart - different products", async () => {
    let thisProductDetails: CartProducts = [];

    await landingPage.clickFirstProductInPopularProduct();
    await iframeUtils.waitForIframeLoad();
    thisProductDetails.push({
      productName: await productPage.extractProductName(),
      productUnitPrice: await productPage.extractProductCurrentPrice(),
      productQuantity: 1,
      productVariation: {}
    });
    
    await productPage.addToCart();
    await productPage.waitForIframeLoad();
    await productPage.awaitPopupModal();
    await productPage.assertModalProductDetails(thisProductDetails[0]); // Test product details on the pop-up modal
    await productPage.continueShopping();
    await productPage.waitForIframeLoad();
    await productPage.goBackToHome();
    await productPage.waitForIframeLoad();

    await landingPage.clickNewProduct();
    await iframeUtils.waitForIframeLoad();
    thisProductDetails.push({
      productName: await productPage.extractProductName(),
      productUnitPrice: await productPage.extractProductCurrentPrice(),
      productQuantity: 1,
      productVariation: {}
    });
    
    await productPage.addToCart();
    await productPage.waitForIframeLoad();
    await productPage.awaitPopupModal();
    await productPage.assertModalProductDetails(thisProductDetails[1]); // Test product details on the pop-up modal
    await productPage.proceedToCheckout();
    await shoppingcartPage.waitForRedirect();
    await shoppingcartPage.assertShoppingCartProductDetails(thisProductDetails); // Test product details on the Shopping Cart page
    await shoppingcartPage.proceedToCheckout();
    await productPage.waitForIframeLoad();
    await checkoutPage.assertCheckoutPagePriceBreakdown(thisProductDetails) //Test product details on the Checkout page
  });
});
