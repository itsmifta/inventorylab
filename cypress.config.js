const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
require("dotenv").config({ path: ".env.example" });

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  config.env.E2E_USERNAME = process.env.E2E_USERNAME;
  config.env.E2E_PASSWORD = process.env.E2E_PASSWORD;
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );
  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    supportFile: "cypress/support/e2e.js",
    specPattern: "**/**/*.feature",
    setupNodeEvents,
  },
});
