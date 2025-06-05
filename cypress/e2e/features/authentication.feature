@smokeTest
Feature: Authentication

Scenario: Login with valid credentials
Given user login using valid credentials
Then user successfully login

Scenario: Login with invalid credentials
Given user login using invalid credentials
Then user cannot login