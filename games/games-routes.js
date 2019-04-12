const router = require('express').Router();

let gamesList = [];

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
    gamesList.push(req.body);
    res.status(201).json(gamesList[gamesList.length - 1]);
  }
});

module.exports = router;
