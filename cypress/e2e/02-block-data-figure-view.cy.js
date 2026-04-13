import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Data Figure Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Data Figure Block: Add and save', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Data Figure Test');
    cy.get('.documentFirstHeading').contains('Data Figure Test');

    cy.getSlate().click();

    // Add data figure block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.content.active.media .button.dataFigure').contains('Data Figure').click();

    // Save
    cy.get('#toolbar-save').click();

    cy.contains('Data Figure Test');
  });
});