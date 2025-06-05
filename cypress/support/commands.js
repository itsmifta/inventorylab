// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import LoginPage from "./pages/LoginPage";
const loginPage = new LoginPage();

Cypress.Commands.add("loginUI", (username, password) => {
  cy.visit("/");
  cy.contains("Login to manage your inventory").should("be.visible");
  cy.get(loginPage.usernameInput).type(username);
  cy.get(loginPage.passwordInput).type(password);
  cy.get(loginPage.loginButton).click();
});
