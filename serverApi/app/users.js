const express = require('express');
const User = require('../models/User');
const auth = require("../middlewares/auth");

const router = express.Router();

router.post('/', async(req, res) => {
  const {username, password} = req.body;

  if(!username || !password){
    res.status(400).send({error: 'Data not valid'});
  }
  const userData = {username, password};
  try{
    const user = new User(userData);
    user.generateToken();
    await user.save();
    res.send(user);
  }catch(e){
    res.status(400).send(e);
  }
});

router.post('/sessions', auth, async (req, res) => {
  req.user.generateToken();
  await req.user.save();

  res.send({message: 'User logged in', token: req.user.token});
});

module.exports = router;