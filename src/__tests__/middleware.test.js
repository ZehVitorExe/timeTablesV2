import { middleware } from '../middleware.js';
import { jest } from '@jest/globals';

class HeadersMock {
  constructor(init) {
    this.map = new Map();
    if (init && typeof init.get === 'function') {
      const auth = init.get('authorization');
      if (auth) this.map.set('authorization', auth);
    } else if (Array.isArray(init)) {
      init.forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
    }
  }
  get(name) {
    return this.map.get(name.toLowerCase()) || null;
  }
  set(name, value) {
    this.map.set(name.toLowerCase(), String(value));
  }
  entries() {
    return this.map.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

describe('autenticação do middleware', () => {
  beforeEach(() => {
    global.Headers = HeadersMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('retorna 401 quando header de autorização ausente em POST', async () => {
    const req = { nextUrl: { pathname: '/api/events' }, method: 'POST', headers: { get: () => null } };

    const res = await middleware(req);

    expect(res).toBeDefined();
    expect(res.status).toBe(401);
  });

  test('retorna 401 quando header de autorização não é Bearer em POST', async () => {
    const req = { nextUrl: { pathname: '/api/events' }, method: 'POST', headers: { get: () => 'Token badtoken' } };

    const res = await middleware(req);

    expect(res.status).toBe(401);
  });

  test('permite POST quando o header Bearer está presente', async () => {
    const req = { nextUrl: { pathname: '/api/events' }, method: 'POST', headers: { get: () => 'Bearer goodtoken' } };

    const res = await middleware(req);

    expect(res).toBeDefined();
    expect(res.status).not.toBe(401);
  });

  test('permite GET sem header de autorização', async () => {
    const req = { nextUrl: { pathname: '/api/events' }, method: 'GET', headers: { get: () => null } };

    const res = await middleware(req);

    expect(res).toBeDefined();
    expect(res.status).not.toBe(401);
  });
});
