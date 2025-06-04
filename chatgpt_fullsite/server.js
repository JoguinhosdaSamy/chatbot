const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));

app.post('/api/gpt-response', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória' });

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }]
        });

        const botReply = response.data.choices[0].message.content;
        res.json({ response: botReply });
    } catch (error) {
        console.error('Erro com a OpenAI:', error);
        res.status(500).json({ error: 'Erro ao obter resposta do modelo' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});