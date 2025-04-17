let API_KEY = prompt('Insira sua chave API do Gemini:') || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.querySelector('button');
let isGenerating = false;

async function sendMessage() {
    if (isGenerating || !userInput.value.trim()) return;

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

function displayMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    messageDiv.innerHTML = text.replace(/\n/g, '<br>');

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleUIState(loading) {
    isGenerating = loading;
    userInput.disabled = loading;
    sendButton.disabled = loading;
    sendButton.style.opacity = loading ? 0.7 : 1;

    if (loading) {
        userInput.placeholder = 'Gerando resposta...';
        userInput.blur();
    } else {
        userInput.placeholder = 'Digite sua mensagem...';
        userInput.value = '';
    }
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

if (!API_KEY) {
    displayMessage('Por favor, recarregue a página e insira sua chave API.', 'error');
    userInput.disabled = true;
    sendButton.disabled = true;
}