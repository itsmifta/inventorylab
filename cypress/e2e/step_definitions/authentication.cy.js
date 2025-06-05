const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");
import LoginPage from "../../support/pages/LoginPage";
import NavigationPage from "../../support/pages/NavigationPage";

const loginPage = new LoginPage();
const username = Cypress.env("E2E_USERNAME");
const password = Cypress.env("E2E_PASSWORD");
const navigationPage = new NavigationPage();

When("user login using valid credentials", () => {
  cy.loginUI(username, password);
});

Then("user successfully login", () => {
  loginPage.verifySuccessfulLogin();
});

When("user login using invalid credentials", () => {
  cy.loginUI("invalidUser", "invalidPassword");
});

Then("user cannot login", () => {
  loginPage.verifyUnsuccessfulLogin();
});

When("user logout", () => {
  navigationPage.logout();
});

Then("user successfully logout", () => {
  loginPage.verifySuccessfulLogout();
});
