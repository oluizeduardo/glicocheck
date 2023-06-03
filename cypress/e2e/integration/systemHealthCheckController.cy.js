describe('System health check test', () => {
  it('should return HTTP 200 informing that the system is running.', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:4500/api/ping',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Pong');
    });
  });
});
