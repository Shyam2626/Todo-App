const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
    task: String,
});

const Task = mongoose.model('Task', taskSchema);

app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.render('index', { tasks });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/', async (req, res) => {
    try {
        let task = req.body.task;
        if (task) {
            await Task.create({ task }); // Create and save a new task in the database
        }
        res.redirect('/'); // Redirect to the home page
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/delete', async (req, res) => {
    try {
        const taskId = req.body.id;
        if (taskId) {
            await Task.findByIdAndRemove(taskId);  // Delete the task from the database
        }
        res.redirect('/');  // Redirect to the home page
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => console.log('Server Started'));
