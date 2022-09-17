const express = require('express');
const auth = require("../middlewares/auth");
const Task = require("../models/Task");

const router = express.Router();

router.get('/', auth, async(req, res) => {
    try {
        const tasks = await Task.find({user: req.user._id});
        res.send(tasks);
    } catch (e) {
        res.status(500).send({error: e.errors});
    }
});

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

router.put('/:id', auth, async(req, res) => {
    const {title, description, status} = req.body;
    if (!title || !status ) {
        return res.status(400).send({error: 'Data not valid!'});
    }
    const taskData = {
        user: req.user._id,
        title,
        description: description || null,
        status
    }
    try{
        const task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).send({message: 'Task not found!'});
        }


        if (req.user._id.equals(task.user)) {
            const updateTask = await Task.findByIdAndUpdate(req.params.id, taskData, {new: true});
            return res.send(updateTask);
        }
        res.send({message: 'You have no rights!'});
    } catch(e) {
        res.status(400).send({error: e.errors});
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById({_id: req.params.id}, "user");

        if (!task) {
            return  res.status(404).send({message: 'Task does not exist!'});
        }

        if (req.user._id.equals(task.user)) {
            await Task.deleteOne({_id: req.params.id});

            return res.send({message: 'Task deleted!'});
        }

        res.send({message: 'You have no rights!'});
    } catch (e) {
        res.status(400).send({error: e.errors});
    }
});

module.exports = router;