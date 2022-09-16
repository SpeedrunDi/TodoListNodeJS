const express = require('express');
const auth = require("../middlewares/auth");
const Task = require("../models/Task");

const router = express.Router();

router.post('/', auth, async(req, res) => {
    const {title, description, status} = req.body;

    if (!title || !status) {
        return res.status(400).send({error: 'Data not valid!'});
    }

    const taskData = {
        user: req.user._id,
        title,
        description: description || null,
        status
    };

    try {
        const task = await new Task(taskData);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send({error: e.errors});
    }
});

module.exports = router;