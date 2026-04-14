import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const setPageTitle = (title) => {
  cy.clearSlateTitle();
  cy.getSlateTitle().type(title);
  cy.get('.documentFirstHeading').contains(title);
};

const addDataFigureBlock = () => {
  cy.getSlate().click();
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get('.blocks-chooser .title').contains('Media').click();
  cy.get('.content.active.media .button.dataFigure')
    .contains('Data Figure')
    .click({ force: true });
};

const uploadSvgToDataFigure = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800" viewBox="0 0 1600 800">
      <rect width="1600" height="800" fill="#d8ecff" />
      <text x="70" y="120" font-size="72" fill="#114477">Data Figure Cypress</text>
    </svg>
  `.trim();

  cy.get('.data-figure-edit input[type="file"]').selectFile(
    {
      contents: Cypress.Buffer.from(svg),
      fileName: 'data-figure-cypress.svg',
      mimeType: 'image/svg+xml',
      lastModified: Date.now(),
    },
    { force: true },
  );
};

describe('Data Figure Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('renders uploaded figure in view mode and supports enlarge action', () => {
    setPageTitle('Data Figure View Test');
    addDataFigureBlock();
    uploadSvgToDataFigure();

    // Wait until real uploaded image replaces empty-state placeholder.
    cy.get('.data-figure-edit .no-image-wrapper').should('not.exist');
    cy.get('.data-figure-edit').contains('Figure 1. data-figure-cypress.svg');
    cy.get(
      '.data-figure-edit img[src*="images/image"], .data-figure-edit svg',
    ).should('have.length.at.least', 1);

    cy.get('#toolbar-save').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/cypress/my-page`);

    cy.get('.data-figure-block').should('be.visible');
    cy.get('.data-figure-block').contains('Figure 1. data-figure-cypress.svg');
    cy.get(
      '.data-figure-block img[src*="images/image"], .data-figure-block svg',
    ).should('have.length.at.least', 1);

    cy.get('.data-figure-toolbar .enlarge .trigger-button')
      .should('be.visible')
      .click();

    cy.get('.data-figure-zoom').should('be.visible');
  });
});
