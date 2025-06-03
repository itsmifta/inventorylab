const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");
import LoginPage from "../../support/pages/LoginPage";
const loginPage = new LoginPage();
const username = Cypress.env("E2E_USERNAME");
const password = Cypress.env("E2E_PASSWORD");

When("user login using valid credentials", () => {
  loginPage.loginUI(username, password);
});

Then("user successfully login", () => {
  loginPage.verifySuccessfulLogin();
});
