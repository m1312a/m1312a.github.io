
const socket = io();
const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
   e.preventDefault();
   sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `num: ${data}`;
});

socket.on('chat-message', (data) => {
    addMessageToUI(false, data);
});

function sendMessage() {
    if (messageInput.value === '') return // عشان يكتب غصب عنه او في بال form then input type="text" u can add required
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        datetime: new Date()
    };
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

function addMessageToUI(isOwnMessage, data) {
    const alignmentClass = isOwnMessage ? 'message-right' : 'message-left';
    const timeAgo = moment(data.datetime).fromNow();
    const messageElement = document.createElement('li');
    messageElement.className = alignmentClass;

    const messageParagraph = document.createElement('p');
    messageParagraph.className = 'message';

    
    messageParagraph.textContent = data.message;

    const messageSpan = document.createElement('span');
    messageSpan.innerHTML = `${data.name} 💗 ${timeAgo}`;

    messageParagraph.appendChild(messageSpan);
    messageElement.appendChild(messageParagraph);

    messageContainer.appendChild(messageElement);
    sc()
}
function sc (){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}
messageInput.addEventListener('focus', (e) =>{
   socket.emit('feedback',{
    feedback:  `${nameInput.value} عم يكتب`
   })

})
messageInput.addEventListener('keypress',(e) => {
    socket.emit('feedback',{
        feedback:  `${nameInput.value} عم يكتب`
       })
})
messageInput.addEventListener('blur',(e) => {
    socket.emit('feedback',{
        feedback:  `` ,
       })
})
socket.on('feedback',data =>{
    const element = `
    <li class="message-feedback">
    <p class="feedback" id="feedback">
       <b><i>ur lover is typing...</i></b>
    </p>
    </li>
    `

})