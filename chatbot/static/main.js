const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageList = document.getElementById('message-list');

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

messageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (messageInput !== '') {
        messages.push({ text: messageInput.value, from: 'user' });
        messageList.innerHTML += messageComponent['user'](messageInput.value);

        let data = new FormData();
        data.append('user_message', messageInput.value);

        messageInput.value = '';

        fetch('/message', {
            method: 'POST',
            body: data,
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        }).then(response => response.json())
            .then((json) => {
                messageList.innerHTML += messageComponent['yoda'](json['answers'][0]['message']);
            })
    }
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