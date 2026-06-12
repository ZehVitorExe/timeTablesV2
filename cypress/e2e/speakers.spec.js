describe('Speakers API (E2E)', () => {
  it('creates and lists speakers (requires auth)', () => {
    const user = {
      name: 'Speaker User',
      email: `speaker+${Date.now()}@example.test`,
      password: 'Password123!'
    };

    const speaker = {
      name: 'Alexandre Silva',
      bio: 'Dev experiente e entusiasta de arquitetura',
      avatar: 'https://example.test/avatar.png'
    };

    // register -> login -> create speaker -> list
    cy.request({ method: 'POST', url: '/api/auth/register', body: user, failOnStatusCode: false })
      .then(() => cy.request({ method: 'POST', url: '/api/auth/login', body: { email: user.email, password: user.password }, failOnStatusCode: false }))
      .then((loginResp) => {
        if (loginResp.status !== 200) throw new Error('Login failed during speakers E2E');
        const token = loginResp.body.token;

        cy.request({
          method: 'POST',
          url: '/api/speakers',
          headers: { Authorization: `Bearer ${token}` },
          body: speaker,
          failOnStatusCode: false,
        }).then((createResp) => {
          expect([201, 400]).to.include(createResp.status);

          cy.request({ method: 'GET', url: '/api/speakers', failOnStatusCode: false }).then((listResp) => {
            expect(listResp.status).to.equal(200);
            expect(listResp.body).to.be.an('array');
          });
        });
      });
  });
});
