const express = require('express');
const router = express.Router();
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
const db = require('../db');

router.get('/', async function(req, res){
    let workouts = [];

    const { rows } = await db.query('SELECT * FROM workouts WHERE user_id = $1', [req.cookies.user.id]);
    console.log(rows);
    rows.forEach(row => {
        workouts.push({id: row.id, day: row.day, name: null})
    })
    try {
        const promises = rows.map(row => {
            console.log(row.exercise_id);
            return db.query('SELECT name FROM exercises WHERE id = $1', [row.exercise_id]);
        });
        const results = await Promise.all(promises);

        for (let i = 0; i < results.length; i++) {
            workouts[i].name = results[i].rows.at(0).name;
        }
        console.log(workouts);
        res.render('plan', {workouts: workouts});
    } catch (error) {
        console.error(error);
    }
});

router.get('/custom', function(req, res){
    const planType = 'Custom';
    res.redirect('/plan');
});

eventEmitter.on('add', () => {
    console.log('Add!');
});

router.post('/', (req, res) => {
    req.session.day = Object.keys(req.body)[0];
    res.redirect('../addExercise');
});

router.post('/delete', async (req,res) => {
    const { workoutId } = req.body;
    await db.query('DELETE FROM workouts WHERE id = $1', [workoutId]);
    res.redirect('/plan');
})
module.exports = router;