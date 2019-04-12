const router = require('express').Router();

let gamesList = [];
let gamesIncrementer = 1;

function handleServerError(res, error) {
  console.error(error);
  return res
    .status(500)
    .json({ message: 'The request could not be completed.', error: error });
}

router.get('/', (req, res) => {
  try {
    res.status(200).json(gamesList);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.get('/:id', (req, res) => {
  console.log('req.params.id', req.params.id);
  for (let game of gamesList) {
    console.log('game.id', game.id);
    if (game.id === Number(req.params.id)) {
      return res.status(200).json(game);
    }
  }
  return res.status(404).json({ message: 'No game found for that ID' });
});

router.post('/', (req, res) => {
  if (!req.body.genre || !req.body.title) {
    return res
      .status(422)
      .json({ message: 'Please include `genre` and `title` properties.' });
  } else {
    for (let game of gamesList) {
      if (game.title === req.body.title) {
        return res
          .status(405)
          .json({ message: `Unique title constraint failed.` });
      }
    }
    gamesList.push({ ...req.body, id: gamesIncrementer++ });
    res.status(201).json(gamesList[gamesList.length - 1]);
  }
});

router.delete('/:id', (req, res) => {
  for (let i = 0; i < gamesList.length; i++) {
    if (gamesList[i].id === Number(req.params.id)) {
      gamesList.splice(i, 1);
      return res.status(204).end();
    }
  }
  return res.status(404).json({ message: 'No record found for that ID' });
});

module.exports = router;
