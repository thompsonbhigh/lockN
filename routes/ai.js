const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/openaiService.js');
const { executeAITool } = require('../services/aiToolExecutor.js');
const { auth } = require('../routes/login.js');

router.get('/', auth, (req, res) => {
    res.render('ai');
});

router.post('/chat', auth, async (req, res) => {
    console.log(req.body);
    const { message } = req.body;
    const userId = req.cookies.user.id;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Message is required'
        });
    }

    try {
        const aiResult = await getAIResponse(message);

        if (aiResult.type === 'tool_call') {
            const executionResult = await executeAITool({
                userId,
                toolName: aiResult.toolName,
                args: aiResult.args
            });

            return res.json({
                success: true,
                type: 'action',
                action: executionResult.action,
                message: executionResult.message,
                data: executionResult.data
            });
        }

        return res.json({
            success: true,
            type: 'message',
            message: aiResult.message
        });
    } catch (error) {
        console.log('AI chat error:', error);

        return res.status(500).json({
            success: false,
            message: 'Something went wrong when proccessing your request'
        });
    }
});

module.exports = router;