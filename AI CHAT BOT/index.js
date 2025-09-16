const API_KEY = "AIzaSyAxH7uHI8MSdPP3DhYZ8mPzTCj8Dco0iyA";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Message cache to reduce API calls
const messageCache = new Map();
const MAX_CACHE_SIZE = 50;

// API Configuration
window.lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 20000; // 20 seconds between requests
let isWaitingForResponse = false;

function setLoading(isLoading) {
    if (!sendButton || !userInput) return;
    const icon = sendButton.querySelector("i");
    if (isLoading) {
        if (icon) icon.className = "fas fa-spinner fa-spin";
        sendButton.disabled = true;
        userInput.disabled = true;
    } else {
        if (icon) icon.className = "fas fa-paper-plane";
        sendButton.disabled = false;
        userInput.disabled = false;
    }
}

// Cache management
function addToCache(question, answer) {
    if (messageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = messageCache.keys().next().value;
        messageCache.delete(firstKey);
    }
    messageCache.set(question.toLowerCase().trim(), answer);
}

function getFromCache(question) {
    return messageCache.get(question.toLowerCase().trim());
}

async function makeRequest(message) {
    const cachedResponse = getFromCache(message);
    if (cachedResponse) {
        return { cached: true, text: cachedResponse };
    }

    try {
        // Using a different endpoint and model
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-latest:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 250,
                    topK: 40,
                    topP: 0.95
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_LOW_AND_ABOVE"
                    }
                ]
            })
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("The service is temporarily busy. Please wait 30 seconds and try again.");
            } else {
                console.error("API Error Response:", responseText);
                throw new Error("Unable to get a response. Please try again in a moment.");
            }
        }

        try {
            const data = JSON.parse(responseText);
            if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
                throw new Error("Invalid response format");
            }

            const answer = data.candidates[0].content.parts[0].text;
            addToCache(message, answer);
            return { cached: false, text: answer };
        } catch (parseError) {
            console.error("Parse error:", parseError);
            throw new Error("Error processing the response. Please try again.");
        }
    } catch (error) {
        console.error("Request error:", error);
        throw error;
    }
}

window.sendMessage = async function() {
    if (!userInput || !chatBox || !sendButton || isWaitingForResponse) return;
    
    const message = userInput.value.trim();
    if (message === "") return;

    // Check cooldown
    const now = Date.now();
    const timeElapsed = now - window.lastRequestTime;
    if (timeElapsed < MIN_REQUEST_INTERVAL) {
        const remainingTime = Math.ceil((MIN_REQUEST_INTERVAL - timeElapsed) / 1000);
        appendMessage("bot", `Please wait ${remainingTime} seconds before sending another message...`);
        return;
    }

    setLoading(true);
    isWaitingForResponse = true;
    appendMessage("user", message);
    userInput.value = "";
    window.lastRequestTime = now;

    let timeoutId = setTimeout(() => {
        if (isWaitingForResponse) {
            isWaitingForResponse = false;
            setLoading(false);
            if (chatBox.lastChild && chatBox.lastChild.textContent === "Thinking...") {
                chatBox.removeChild(chatBox.lastChild);
            }
            appendMessage("bot", "Request timed out. Please try again.");
        }
    }, 30000); // 30 second timeout

    try {
        const thinkingMsg = appendMessage("bot", "Thinking...");
        const response = await makeRequest(message);
        
        if (thinkingMsg && thinkingMsg.parentNode === chatBox) {
            thinkingMsg.remove();
        }

        // Add small delay for cached responses to feel more natural
        if (response.cached) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        appendMessage("bot", response.text);
    } catch (error) {
        console.error("Error details:", error);
        const lastMessage = chatBox.lastChild;
        if (lastMessage && lastMessage.textContent === "Thinking...") {
            lastMessage.remove();
        }
        appendMessage("bot", error.message || "An error occurred. Please try again later.");
    } finally {
        clearTimeout(timeoutId);
        setLoading(false);
        isWaitingForResponse = false;
    }
};

function appendMessage(sender, text) {
    if (!chatBox) return;
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

if (userInput) {
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey && !userInput.disabled) {
            e.preventDefault();
            window.sendMessage();
        }
    });
}

window.refreshChat = function() {
    if (chatBox) {
        chatBox.innerHTML = "";
        messageCache.clear();
        isWaitingForResponse = false;
    }
};

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const chatContainer = document.querySelector(".chat-container");
const inputField = document.querySelector("input");

if (themeToggle && chatContainer && inputField) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        chatContainer.classList.toggle("light-mode");
        inputField.classList.toggle("light-mode");
        if (sendButton) sendButton.classList.toggle("light-mode");

        const messages = document.querySelectorAll(".message");
        messages.forEach(msg => msg.classList.toggle("light-mode"));
    });
}
