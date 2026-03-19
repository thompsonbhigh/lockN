const {
    createTaskSchema,
    createGoalSchema,
    createWorkoutSchema
} = require('../validators/aiSchemas.js');

const { createTask } = require('../db/tasksDb.js');

async function executeAITool({ userId, toolName, args}) {
    console.log('ARGS: ', args);
    console.log('AI TOOL: ', toolName);
    
    switch (toolName) {
        case 'create_task': {
            const parsed = createTaskSchema.parse({
                ...args
            });

            const task = await createTask(userId, parsed);

            return {
                action: 'create_task',
                message: `Created task: ${task.name}`,
                data: task
            };
        }

        default:
            throw new Error(`Unsupported tool: ${toolName}`);
    }
}

module.exports = {
    executeAITool
};