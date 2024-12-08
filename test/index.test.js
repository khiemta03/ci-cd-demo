const request = require('supertest');
const { app } = require('../src/index');

let server;

beforeAll((done) => {
    const testPort = process.env.TEST_PORT || 3001;
    server = app.listen(testPort, () => {
        global.agent = request.agent(server);
        console.log(`Test server started on port ${testPort}`);
        done();
    });
}, 10000);

afterAll((done) => {
    if (server) {
        server.close(() => {
            console.log('Test server closed');
            done();
        });
    } else {
        done();
    }
});

describe('User API endpoints', () => {
    describe('GET /users', () => {
        it('should return all users', async () => {
            const res = await global.agent
                .get('/users')
                .expect(200);

            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(5);
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
