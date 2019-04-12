const server = require('../server');
const request = require('supertest');

describe('Games Routes', async () => {
  describe('GET /', async () => {
    it('Always returns an array and status 200', () => {
      request(server)
        .get('/api/games')
        .then(response => {
          expect(response.status).toBe(200);
          expect(response).toHaveProperty('type', 'application/json');
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
    it('Returns an array of games and status 200', () => {
      request(server)
        .post('/api/games')
        .send({
          title: 'Pacwoman',
          genre: 'Arcade',
          releaseYear: 1981
        })
        .then(res => {
          request(server)
            .get('/api/games')
            .then(response => {
              expect(response.status).toBe(200);
              expect(response).toHaveProperty('type', 'application/json');
              expect(Array.isArray(response.body)).toBe(true);
              expect(response.body[0]).toHaveProperty('genre', 'Arcade');
              expect(response.body[0]).toHaveProperty('id', 1);
              expect(response.body[0]).toHaveProperty('releaseYear', 1981);
              expect(response.body[0]).toHaveProperty('title', 'Pacwoman');
            });
        });
    });
  });
  describe('GET /:id', async () => {
    it('Takes an `:id` url parameter and returns the corresponding game', async () => {
      const specific = await request(server).get('/api/games/1');

      expect(specific.status).toBe(200);
      expect(specific.type).toBe('application/json');
      expect(specific.body).toHaveProperty('genre', 'Arcade');
      expect(specific.body).toHaveProperty('id', 1);
      expect(specific.body).toHaveProperty('releaseYear', 1981);
      expect(specific.body).toHaveProperty('title', 'Pacwoman');
    });
  });

  describe('POST /', async () => {
    it('Takes a game object, and returns the newly stored record', async () => {
      const pacman = await request(server)
        .post('/api/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1980
        });

      expect(pacman).toHaveProperty('status', 201);
      expect(pacman).toHaveProperty('type', 'application/json');
      expect(pacman.body).toHaveProperty('genre', 'Arcade');
      expect(pacman.body).toHaveProperty('id', 2);
      expect(pacman.body).toHaveProperty('releaseYear', 1980);
      expect(pacman.body).toHaveProperty('title', 'Pacman');
      expect(Array.isArray(pacman.body)).toBe(false);
    });

    it('Rejects a POST without required properties with status 422', async () => {
      const failure = await request(server)
        .post('/api/games')
        .send({
          titl: 'Fake Game', // intentionally misspelled key
          genre: 'Who cares',
          releaseYear: 2000
        });

      expect(failure).toHaveProperty('status', 422);
      expect(failure.body).toHaveProperty('message');
    });

    it('Rejects a POST if `title` is already persisted', async () => {
      const repeated = await request(server)
        .post('/api/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1982
        });

      expect(repeated).toHaveProperty('status', 405);
      expect(repeated.body).toHaveProperty('message');
    });
  });

  describe('DELETE /:id', async () => {
    it('Takes an ID and deletes the corresponding record', async () => {
      const deleted = await request(server).del('/api/games/1');

      expect(deleted).toHaveProperty('status', 204);
      expect(deleted.body).not.toHaveProperty('message');
    });

    it('Returns a 404 response if the ID is not found', async () => {
      const badDelete = await request(server).del('/api/games/420');

      expect(badDelete).toHaveProperty('status', 404);
    });
  });
});
