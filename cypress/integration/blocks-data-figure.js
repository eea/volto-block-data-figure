import { setupBeforeEach, tearDownAfterEach } from '../support';
//import { getFigure, getData } from '../mocks/staticFigure';


describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Data Figure block: Empty', () => {
    // Change page title
    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
      .clear()
      .type('My Add-on Page')
      .get('.documentFirstHeading span[data-text]')
      .contains('My Add-on Page');

    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
      '{enter}',
    );

    // Add metadata block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.ui.basic.icon.button.dataFigure').contains('Data Figure').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
  });

  // it('Add Data Figure with static figures', () => {
  //   const staticUrl =
  //     'https://eea.europa.eu/SITE/data-and-maps/figures/the-average-summer-season-intensity';
  //   cy.server();
  //   cy.fixture('./example.json').then((items) => {
  //     getData(items);
  //   });
  //   cy.fixture('./figure.json').then((items) => {
  //     getFigure(items);
  //   });
  //   cy.route({
  //     method: 'GET',
  //     url: '/api/@geodata',
  //     response: {
  //       password: 'test123',
  //     },
  //   }).as('geodata');
  //   // Change page title
  //   cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
  //     .clear()
  //     .type('My Add-on Page')
  //     .get('.documentFirstHeading span[data-text]')
  //     .contains('My Add-on Page');

  //   cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
  //     '{enter}',
  //   );
  //   cy.get('.ui.basic.icon.button.block-add-button').first().click();
  //   cy.get('.blocks-chooser .title').contains('Media').click();
  //   cy.get('.ui.basic.icon.button.dataFigure').contains('Data Figure').click();
  //   cy.get('.ui:nth-child(3) > input').click();
  //   cy.get('.ui:nth-child(3) > input').type(staticUrl);
  //   cy.get('.primary > .icon').click();
  //   cy.wait(1000);

  //   cy.get('div.block.image')
  //     .find('img')
  //     .invoke('width')
  //     .should('be.greaterThan', 0);

  //   cy.get('div.block.image').find('img').should('be.visible');
  //   cy.get('#toolbar-save > .icon')
  //     .click()
  //     .then(() => {
  //       cy.wait(1000);
  //       cy.get('.scene img').should('be.visible');
  //     });
  // });
});
