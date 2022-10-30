const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageList = document.getElementById('message-list');
const clearButton = document.getElementById('clear-btn');
const yodaTyping = document.getElementById('yoda-is-typing');

const messageComponent = {
    'user': (text) =>
        `<div class="flex align-middle my-2 text-justify flex-row-reverse">
        <img
            class="h-10 w-10"
            alt="user-avatar"
            src="/static/user.svg"
        />
        <div class="rounded p-3 text-sm mx-2 bg-green-900">
            ${text}
        </div>
    </div>`
    ,
    'yoda': (text) =>
        `<div class="flex align-middle my-2 text-justify">
        <img
            class="h-10 w-10"
            alt="yoda-avatar"
            src="/static/yoda.png"
        />
        <div class="rounded p-3 text-sm mx-2 bg-green-300 text-black">
            ${text}
        </div>
    </div>`
}

let messages = [];
if (localStorage.getItem('messages')) {
    try {
        messages = JSON.parse(localStorage.getItem('messages'));
        for (const message of messages) {
            messageList.innerHTML += messageComponent[message.from](message.text);
        }
    } catch (e) {
        messages = [];
        localStorage.removeItem('messages');
    }
}

messageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (messageInput.value !== '') {
        handleMessage(messageInput.value, 'user');

        let data = new FormData();
        data.append('user_message', messageInput.value);

        messageInput.value = '';
        yodaTyping.classList.remove('hidden');

        fetch('/message', {
            method: 'POST',
            body: data,
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        }).then(response => response.text())
            .then((text) => {
                yodaTyping.classList.add('hidden');
                handleMessage(text, 'yoda');
            })
    }
});

clearButton.addEventListener('click', function () {
    messageList.innerHTML = '';
    messages = [];
    localStorage.removeItem('messages')
});

function handleMessage(text, from) {
    messageList.innerHTML += messageComponent[from](text);
    messages.push({
        'text': text,
        'from': from
    });
    localStorage.setItem('messages', JSON.stringify(messages))
}

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