const chatScroll = document.getElementById("chat-scroll");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messageList = document.getElementById("message-list");
const clearButton = document.getElementById("clear-btn");
const botTyping = document.getElementById("bot-is-typing");

const messageComponent = {
  user: (text) =>
    `<div class="message user-message">
        <img
            class="message-img"
            alt="user-avatar"
            src="user.svg"
        />
        <div>
            ${text}
        </div>
    </div>`,
  bot: (text) =>
    `<div class="message bot-message">
        <img
            class="message-img"
            alt="bot-avatar"
            src="robot.svg"
        />
        <div>
            ${text}
        </div>
    </div>`,
};

let past_user_inputs = [],
  generated_responses = [];
if (
  localStorage.getItem("past_user_inputs") &&
  localStorage.getItem("generated_responses")
) {
  try {
    past_user_inputs = JSON.parse(localStorage.getItem("past_user_inputs"));
    generated_responses = JSON.parse(
      localStorage.getItem("generated_responses")
    );
    for (let i = 0; i < past_user_inputs.length; i++) {
      messageList.innerHTML += messageComponent["user"](past_user_inputs[i]);
      messageList.innerHTML += messageComponent["bot"](generated_responses[i]);
    }
    chatScroll.scrollIntoView({ behavior: "smooth", block: "end" });
  } catch (e) {
    messageList.innerHTML = "";
    (past_user_inputs = []), (generated_responses = []);
    localStorage.removeItem("past_user_inputs");
    localStorage.removeItem("generated_responses");
  }
}

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (messageInput.value !== "") {
    input = messageInput.value;
    messageList.innerHTML += messageComponent["user"](input);
    botTyping.style.visibility = "visible";
    chatScroll.scrollIntoView({ behavior: "smooth", block: "end" });
    messageInput.disabled = true;

    messageInput.value = "";

    fetch("/message", {
      method: "POST",
      body: JSON.stringify({
        inputs: {
          past_user_inputs: past_user_inputs,
          generated_responses: generated_responses,
          text: input,
        },
      }),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const text = data["generated_text"];
        past_user_inputs.push(input);
        localStorage.setItem(
          "past_user_inputs",
          JSON.stringify(past_user_inputs)
        );

        botTyping.style.visibility = "hidden";
        messageList.innerHTML += messageComponent["bot"](text);
        chatScroll.scrollIntoView({ behavior: "smooth", block: "end" });
        messageInput.disabled = false;

        generated_responses.push(text);
        localStorage.setItem(
          "generated_responses",
          JSON.stringify(generated_responses)
        );
      });
  }
});

clearButton.addEventListener("click", function () {
  messageList.innerHTML = "";
  (past_user_inputs = []), (generated_responses = []);
  localStorage.removeItem("past_user_inputs");
  localStorage.removeItem("generated_responses");
});
