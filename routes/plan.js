const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('./login');

let workouts = [];
let isEditing = null;
let currDay;

router.get('/', auth, async function(req, res){
    workouts = [];
    isEditing = false;

    const workoutNamesInfo = await db.query('SELECT DISTINCT name, day FROM workouts WHERE user_id = $1 ORDER BY day ASC', [req.cookies.user.id]);
    const workoutNames = workoutNamesInfo.rows;
    const {rows} = await db.query('SELECT exercises.name AS exercise_name, workouts.id, workouts.day, workouts.name FROM workouts JOIN exercises ON workouts.exercise_id = exercises.id WHERE user_id = $1 ORDER BY index ASC',
         [req.cookies.user.id]);
    workouts = rows;
    console.log(workouts);
    console.log(workoutNames);
    res.render('plan', {workouts: workouts, workoutNames: workoutNames});
});

router.get('/custom', function(req, res){
    const planType = 'Custom';
    res.redirect('/plan');
});

router.post('/', (req, res) => {
    req.session.day = req.body.day;
    res.redirect('../addExercise');
});

router.post('/delete', async (req,res) => {
    const { workoutId } = req.body;
    const deletedIndexInfo = await db.query('DELETE FROM workouts WHERE id = $1 RETURNING index', [workoutId]);
    const deletedIndex = deletedIndexInfo.rows.at(0).index;
    await db.query('UPDATE workouts SET index = index - 1 WHERE user_id = $1 AND index > $2', [req.cookies.user.id, deletedIndex]);
    res.redirect('/plan/edit');
});

router.get('/edit', async (req, res) => {
    if (!isEditing) {
        const dayInfo = await db.query('SELECT day FROM workouts WHERE user_id = $1 ORDER BY day DESC LIMIT 1', [req.cookies.user.id]);
        currDay = dayInfo.rows.at(0)?.day;
        if (currDay == undefined) {
            currDay = 0;
        } else {
            currDay += 1;
        }
    }
    console.log(currDay);
    isEditing = true;
    const newWorkoutsInfo = await db.query(
        'SELECT exercises.name, workouts.day, workouts.id FROM workouts JOIN exercises ON workouts.exercise_id = exercises.id WHERE user_id = $1 AND day = $2 ORDER BY index ASC',
         [req.cookies.user.id, currDay]);
    const newWorkouts = newWorkoutsInfo.rows;
    res.render('editWorkout', {workouts: newWorkouts, day: currDay});
});

router.post('/confirm', async (req, res) => {
    isEditing = false;
    const name = req.body.workoutname;
    await db.query('UPDATE workouts SET name = $1 WHERE user_id = $2 AND day = $3', [name, req.cookies.user.id, currDay]);
    res.redirect('/plan');
});

module.exports = router;