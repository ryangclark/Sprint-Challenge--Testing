const express = require('express');
const server = express();

const gamesRoutes = require('./games/games-routes');

server.use(express.json());
server.use('/api/games', gamesRoutes);

module.exports = server;
