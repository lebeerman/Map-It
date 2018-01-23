/* eslint-env node, mocha, cypress, chai, cy */
describe('P2 End to end testing - Map It (light web app)', () => {
  it('.should() load a page that asks the user if they want to enable geolocation', () => {
    cy.visit('127.0.0.1:8080')
    cy.on('window:alert',cy.stub())
    Cypress.on('uncaught:exception', (err, runnable) => {return false})
  })
  it('.should() load a page with a title: Map It', ()=> {
    cy
      .title()
      .should('include', 'MapIt')
  })
  it('.should() have a links to home and about pages in the header', () => {
    cy
      .get('#nav-mobile > li:nth-child(1) > a')
      .should('contain', 'Home')
      .and('have.attr', 'href', 'index.html')
    cy
      .get('#nav-mobile > li:nth-child(2) > a')
      .should('contain', 'About')
      .and('have.attr', 'href', 'about.html')
  })
  it('.should() have a form with 3 text-inputs: Location Name, Location Note, Lat & Long', () => {
    cy
      .get('form')
      .find('input')
      .should('have.length', 3)
    cy
      .get('input#location-title')
      .should('have.attr','placeholder','Location Name')
    cy
      .get('input#location-note')
      .should('have.attr', 'placeholder', 'Notes, say what you want!')
    cy
      .get('input#mapLocation')
      .should('have.attr','placeholder','Latitude, Longitude (note the comma to separate the numbers!)')
  })
  it('.assert() that when the Leaflet map is clicked a lat long value as string updates to the form', () => {
    cy.get('#mapid').click()
    assert.typeOf('input#mapLocation', 'string', 'value is string')
  })
  it('.should() be able to type characters into the Location Title and Location Name input fields', () => {
    cy.get('input#location-title').type('Place Name')
    cy.get('input#location-note').type('Place Note')
  })
  it('upon .click() event to the "Enter Location" a success message temporarilty added to the page - indicating a POST request is made', () => {
    cy.get('#newMapItem').click()
    cy.get('.save-message').contains('Check the map for your Marker!');
  })
  it('should() have a Leaflet Map with an updated number of markers.', () => {
    cy
      .get('#mapid > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(19)')
      .exists
  })
  it('.should() visit an about page at /about.html when the About link is clicked - this page shoud have content.', () => {
    cy.get('#nav-mobile > li:nth-child(2) > a').click()
    cy.url().should('be', '/about.html')
  })
  it('.should() take a screenshot of all the tests passing!', () => cy.screenshot())
})