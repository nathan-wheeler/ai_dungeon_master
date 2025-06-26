const sendButton = document.getElementById('send-button');
const rollButton = document.getElementById('roll-button');
const userInput = document.getElementById('user-input');
const responseDiv = document.getElementById('response');
const max_messages = 10;
const summary_chunk_size = 6;
let messages = [];
let oldMessages = [];
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

import instructions from './instructions.txt';

messages.push({ role: "system", content: instructions });
messages.push({ role: "system", content: ''})

userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendButton.click();
})

async function summarizeOldMessages(oldMessages){
    const summaryPrompt = [
        {role: "system", content: "Summarize the following conversation so far for context in 100 words or less"},
        ...oldMessages
    ];
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: summaryPrompt,
            max_tokens: 1000
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if(!userMessage) return
    userInput.value = "Loading...";
    sendButton.disabled = true;
    userInput.disabled = true;
    messages.push({role:'user', content: userMessage});
    console.log("Messages being sent to GPT:", messages);
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: messages,
                max_tokens: 1000      
            })
        });
        const data = await response.json();
        const botReply = data.choices[0].message.content;
        responseDiv.innerHTML += `<p><b>You:</b> ${userMessage}</p>`
        responseDiv.innerHTML += `<p><b>DM:</b> ${botReply.replace(/\n/g, "<br>")}</p>`
        messages.push({ role: 'assistant', content: botReply });
        while(messages.length > max_messages + 2){
            const removed = messages.splice(2,summary_chunk_size);
            oldMessages.push(...removed);
        }
        if (oldMessages.length >= summary_chunk_size) {
            const summary = await summarizeOldMessages(oldMessages);
            messages.splice(1, 1, {role: 'system', content: `Summary of previous messages: ${summary}` });
            oldMessages = [];
        }
    } catch(error) {
        console.error('Error:',error);
        responseDiv.innerHTML += `<p class=text-red-500"><b>Error:</b> ${error.message}</p>`
    }
    userInput.value = ""
    sendButton.disabled = false;
    userInput.disabled = false;
    responseDiv.scrollTop = responseDiv.scrollHeight;
});

rollButton.addEventListener('click', event => {
    userInput.value = Math.floor(Math.random() * 20) + 1
    sendButton.click();
});

