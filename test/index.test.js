const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    global.agent = request.agent(server);
    console.log('Test server started on port 4000');
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log('Test server closed');
    done();
  });
});

describe('User API endpoints', () => {
  describe('GET /users', () => {
    it('should return all users', async () => {
      const res = await global.agent
        .get('/users')
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty('name', 'Alice');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user when valid ID is provided', async () => {
      const res = await global.agent
        .get('/users/1')
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name', 'Alice');
    });

    it('should return 404 when user is not found', async () => {
      await global.agent
        .get('/users/999')
        .expect(404);
    });
  });
});
