import product from "../../fixtures/product.json";
const newProduct = product.newProduct;
class ProductListPage {
  // Selectors
  pageTitle = '[data-testid="product-list-title"]';
  addProductButton = 'button[data-testid="add-product-button"]';
  formTitle = '[data-testid="form-title"]';
  submitForm = '[data-testid="submit-product"]';
  snackbar = 'div[data-testid="snackbar"]';

  // Actions
  clickAddProduct() {
    cy.get(this.addProductButton).click();
  }

  fillAddProductForm() {
    cy.get('input[name="code"]').type(newProduct.code);
    cy.get('input[name="name"]').type(newProduct.name);
    cy.get('input[name="price"]').type(newProduct.price);
    cy.get('input[name="quantity"]').type(newProduct.quantity);
    cy.get('input[name="expiry"]').type(newProduct.expiry);
  }

  submitProduct() {
    cy.get(this.submitForm).click();
  }

  // Assertions
  verifyProductAdded() {
    cy.contains(
      this.snackbar,
      `${'Product "' + newProduct.name + '" has been added successfully!'}`
    ).should("be.visible");
    cy.wait(3000);
    cy.get(this.snackbar).should("not.be.visible");
  }
}

export default ProductListPage;
