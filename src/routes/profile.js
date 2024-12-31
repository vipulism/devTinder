const express = require("express");
const {userAuth} = require('../middleware/auth');
const router = express.Router();


router.get('/profile', userAuth, async (req, res) => {
  
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      res.status(400).send(`${error.message}: err in getting user profile`);
    }
  });

  module.exports = router;