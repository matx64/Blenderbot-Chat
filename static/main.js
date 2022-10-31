const chatScroll = document.getElementById('chat-scroll');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageList = document.getElementById('message-list');
const clearButton = document.getElementById('clear-btn');
const botTyping = document.getElementById('bot-is-typing');

const messageComponent = {
    'user': (text) =>
        `<div class="flex align-middle my-2 text-justify flex-row-reverse">
        <img
            class="h-10 w-10"
            alt="user-avatar"
            src="/static/user.svg"
        />
        <div class="rounded p-3 text-sm mx-2 bg-blue-900">
            ${text}
        </div>
    </div>`
    ,
    'bot': (text) =>
        `<div class="flex align-middle my-2 text-justify">
        <img
            class="h-10 w-10"
            alt="bot-avatar"
            src="/static/robot.svg"
        />
        <div class="rounded p-3 text-sm mx-2 bg-blue-300 text-black">
            ${text}
        </div>
    </div>`
}

let past_user_inputs = [], generated_responses = [];
if (localStorage.getItem('past_user_inputs') && localStorage.getItem('generated_responses')) {
    try {
        past_user_inputs = JSON.parse(localStorage.getItem('past_user_inputs'));
        generated_responses = JSON.parse(localStorage.getItem('generated_responses'));
        for (let i = 0; i < past_user_inputs.length; i++){
            messageList.innerHTML += messageComponent['user'](past_user_inputs[i]);
            messageList.innerHTML += messageComponent['bot'](generated_responses[i]);
        }
        chatScroll.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (e) {
        messageList.innerHTML = '';
        past_user_inputs = [], generated_responses = [];
        localStorage.removeItem('past_user_inputs');
        localStorage.removeItem('generated_responses');
    }
}

messageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (messageInput.value !== '') {
        messageList.innerHTML += messageComponent['user'](messageInput.value);
        botTyping.classList.remove('invisible');
        chatScroll.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        past_user_inputs.push(messageInput.value);
        localStorage.setItem('past_user_inputs', JSON.stringify(past_user_inputs));

        messageInput.value = '';

        fetch('/message', {
            method: 'POST',
            body: JSON.stringify({
                'past_user_inputs': past_user_inputs,
                'generated_responses': generated_responses
            }),
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then((text) => {
                botTyping.classList.add('invisible');
                messageList.innerHTML += messageComponent['bot'](text);
                chatScroll.scrollIntoView({ behavior: 'smooth', block: 'end' });

                generated_responses.push(text);
                localStorage.setItem('generated_responses', JSON.stringify(generated_responses));
            })
    }
});

clearButton.addEventListener('click', function () {
    messageList.innerHTML = '';
    past_user_inputs = [], generated_responses = [];
    localStorage.removeItem('past_user_inputs');
    localStorage.removeItem('generated_responses');
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}