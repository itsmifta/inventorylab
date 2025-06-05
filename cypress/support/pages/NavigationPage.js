class NavigationPage {
  // Selectors
  logoutButton = '[data-testid="logout-button"]';

  // Actions
  logout() {
    cy.get(this.logoutButton).click();
  }
}

export default NavigationPage;
