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
  });

  describe('GET /', async () => {
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
              expect(response.body[0]).toHaveProperty('title', 'Pacwoman');
              expect(response.body[0]).toHaveProperty('genre', 'Arcade');
              expect(response.body[0]).toHaveProperty('releaseYear', 1981);
            });
        });
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
      const failure = await request(server)
        .post('/api/games')
        .send({
          titl: 'Fake Game', // intentionally misspelled key
          genre: 'Who cares',
          releaseYear: 2000
        });

      expect(pacman).toHaveProperty('status', 201);
      expect(pacman).toHaveProperty('type', 'application/json');
      expect(pacman.body).toHaveProperty('title', 'Pacman');
      expect(pacman.body).toHaveProperty('genre', 'Arcade');
      expect(pacman.body).toHaveProperty('releaseYear', 1980);
      expect(Array.isArray(pacman.body)).toBe(false);

      expect(failure).toHaveProperty('status', 422);
      expect(failure.body).toHaveProperty('message');
    });
  });
});
