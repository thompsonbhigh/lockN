const { z } = require('zod');

const createTaskSchema = z.object({
    name: z.string().min(1).max(120)
});

const createGoalSchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(['weekly', 'monthly', 'yearly'])
});

const createWorkoutSchema = z.object({
    name: z.string().min(1).max(20),
    exercises: z.array(
        z.object({
            name: z.string().min(1).max(100)
        })
    ).max(20)
});

module.exports = {
    createTaskSchema,
    createGoalSchema,
    createWorkoutSchema
};