describe('Events API (E2E)', () => {
  it('registers user, logs in, then POST /api/events returns 201 or 409', () => {
    const user = {
      name: 'Cypress User',
      email: `cypress+${Date.now()}@example.test`,
      password: 'Password123!'
    };

    const payload = {
      title: 'Cypress Event',
      description: 'E2E test',
      startDate: new Date(Date.now() + 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7200 * 1000).toISOString(),
    };

    // Try to register (ignore failure if already exists)
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      body: user,
      failOnStatusCode: false,
    }).then(() => {
      // Login to obtain token
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { email: user.email, password: user.password },
        failOnStatusCode: false,
      }).then((loginResp) => {
        expect(loginResp.status).to.be.oneOf([200, 401]);
        if (loginResp.status !== 200) {
          // If login failed, stop the test with that error
          throw new Error('Login failed during E2E test');
        }

        const token = loginResp.body?.token;
        expect(token).to.be.a('string');

        cy.request({
          method: 'POST',
          url: '/api/events',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
          failOnStatusCode: false,
        }).then((resp) => {
          expect([201, 409]).to.include(resp.status);
        });
      });
    });
  });
});
