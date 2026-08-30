const { default: ollama } = require('ollama');

const getBotAnswer = async (message) => {

    console.log('BotAnswer Reached...')
    try {
        const response = await ollama.chat({
            model: 'gemma2:2b',
            messages: [
                { role: 'system', content: 'You are IKG, a composed and helpful AI assistant. You are willing to assist with tasks or have a thoughtful conversation. Keep your tone professional, concise, and completely avoid using emojis.' },
                { role: 'user', content: message }
            ],
        });
        return response.message.content;
    } catch (error) {
        console.error("Ollama Error:", error);
        return "Sorry, I am having trouble connecting to my AI brain right now.";
    }
}

module.exports = { getBotAnswer };