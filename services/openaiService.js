const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
You are the AI action assistant for the lockN productivity app.

Your job is to help users create tasks, goals, and workouts.
When the user asks to add, plan, or create one of these, call the appropriate tool.
Do not invent database IDs.
Do not say something was saved unless a tool was actually called successfully.
Use concise, structured arguments.
If the request is unclear, make the most reasonable assumption.
If the user is just chatting, respond normally without calling a tool.
`;

const tools = [
    {
        type: 'function',
        name: 'create_task',
        description: 'Create a task for the current user',
        parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
                name: {
                    type: 'string',
                    description: 'Short task name'
                },
            },
            required: ['name']
        }
    }
];

async function getAIResponse(message) {
    const response = await client.responses.create({
        model: 'gpt-5',
        input: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: message
            }
        ],
        tools,
        store: false
    });

    const toolCall = response.output?.find(item => item.type === 'function_call');

    if (toolCall) {
        return {
            type: 'tool_call',
            toolName: toolCall.name,
            args: JSON.parse(toolCall.arguments)
        };
    }

    return {
        type: 'message',
        message: response.output_text || 'Done.'
    };
}

module.exports = {
    getAIResponse,
    tools
};