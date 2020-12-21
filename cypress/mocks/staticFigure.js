export const getData = (res, info, type) => {
  const staticUrl =
    'https://eea.europa.eu/SITE/data-and-maps/figures/the-average-summer-season-intensity';
  cy.route({
    method: 'GET',
    url: staticUrl,
    response: res,
  }).as('getData');
};

export const getFigure = (res, info, type) => {
  const staticUrl =
    'https://eea.europa.eu/SITE/data-and-maps/figures/the-average-summer-season-intensity/the-average-summer-season-intensity';
  cy.route({
    method: 'GET',
    url: staticUrl,
    response: res,
  }).as('getFigure');
};
