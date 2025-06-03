import ProductListPage from "./ProductListPage";
const productListPage = new ProductListPage();

class LoginPage {
  // Selectors
  usernameInput = 'input[data-testid="username-input"]';
  passwordInput = 'input[data-testid="password-input"]';
  toggleVisibility = 'button[data-testid="toggle-password-visibility"]';
  loginButton = 'button[data-testid="login-button"]';

  // Actions
  loginUI(username, password) {
    cy.visit("/");
    cy.get(this.usernameInput).type(username);
    cy.get(this.passwordInput).type(password);
    cy.get(this.loginButton).click();
    return this;
  }

  // Assertions
  verifySuccessfulLogin() {
    cy.get(productListPage.pageTitle).should("exist");
    return this;
  }
}

export default LoginPage;
