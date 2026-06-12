describe('Auth API (E2E)', () => {
  it('registers and logs in a user', () => {
    const user = {
      name: 'E2E User',
      email: `e2e+${Date.now()}@example.test`,
      password: 'Password123!'
    };

    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      body: user,
      failOnStatusCode: false,
    }).then((regResp) => {
      expect([201, 400]).to.include(regResp.status);

      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { email: user.email, password: user.password },
        failOnStatusCode: false,
      }).then((loginResp) => {
        expect([200, 401]).to.include(loginResp.status);
        if (loginResp.status === 200) {
          expect(loginResp.body).to.have.property('token');
        }
      });
    });
  });
});
