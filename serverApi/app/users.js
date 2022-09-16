const express = require('express');
const User = require('../models/User');

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

router.post('/sessions', async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      return res.status(401).send({error: 'Username and password are incorrect'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(401).send({error: 'Username and password are incorrect'});
    }

    user.generateToken();
    await user.save();

    res.send({token: user.token});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;