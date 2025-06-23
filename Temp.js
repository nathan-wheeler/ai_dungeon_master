window.addEventListener('beforeunload', () => {
    localStorage.setItem('messageHistory', JSON.stringify(messages));
    localStorage.setItem('chatHistory', responseDiv.innerHTML);
});

window.addEventListener('load', () => {
    const messageSaved = localStorage.getItem('messageHistory');
    const chatSaved = localStorage.getItem('chatHistory');
    if (messageSaved) {
        messages = JSON.parse(messageSaved);
    }
    if (chatSaved){
        responseDiv.innerHTML = chatSaved;
    }
});

fetch('instructions.txt')
    .then(response => response.text())
    .then(instructions => {
        messages.push({ role: "system", content: instructions});
    })
    .catch(error => {
        console.error("Failed to load instructions:", error);
    });