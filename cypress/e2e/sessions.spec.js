describe('API de Sessões (E2E)', () => {
  it('lista sessões (requer autenticação)', () => {
    const user = {
      name: 'Session User',
      email: `session+${Date.now()}@example.test`,
      password: 'Password123!'
    };

    cy.request({ method: 'POST', url: '/api/auth/register', body: user, failOnStatusCode: false })
      .then(() => cy.request({ method: 'POST', url: '/api/auth/login', body: { email: user.email, password: user.password }, failOnStatusCode: false }))
      .then((loginResp) => {
        if (loginResp.status !== 200) throw new Error('Login failed during sessions E2E');
        const token = loginResp.body.token;

        cy.request({ method: 'GET', url: '/api/sessions', headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false })
          .then((resp) => {
            expect(resp.status).to.equal(200);
            expect(resp.body).to.be.an('array');
          });
      });
  });
});
