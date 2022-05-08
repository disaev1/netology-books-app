const express = require('express');

const router = express.Router();

router.get('/login', (__, res) => {
  res.status(201);
  res.send({ id: 1, mail: "test@mail.ru" });
});

module.exports = router;
