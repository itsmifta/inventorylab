const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");
import ProductListPage from "../../support/pages/ProductListPage";

const productListPage = new ProductListPage();

When("user create new valid product", () => {
  productListPage.clickAddProduct();
  productListPage.fillAddProductForm();
  productListPage.submitProduct();
});

Then("new product successfully created", () => {
  productListPage.verifyProductAdded();
});
