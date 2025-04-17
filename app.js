let API_KEY = prompt('Insira sua chave API do Gemini:') || '';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.querySelector('button');
let isGenerating = false;

async function sendMessage() {
    if (isGenerating || !userInput.ariaValueMax.trim()) return;

    try {
        toggleUIState(true);
        const userMessage = userInput.value;
        displayMessage(userMessage, 'user');

        const botResponse = await getGeminiResponse(userMessage);
        displayMessage(botResponse, 'bot');

    } catch (error) {
        console.error('Erro:', error);
        displayMessage('Desculpe, tive um problema. Tente novamente!', 'error');
    } finally {
        toggleUIState(false);
    }
}

async function getGeminiResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify ({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

//funções de interface