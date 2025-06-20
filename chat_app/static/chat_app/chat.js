// contact-name
$(document).ready(function(){
let users = document.querySelectorAll('.contact-item')
let groups = document.querySelectorAll('.group-item')
// group-item
let currentIcon = document.querySelector('.current-group-avatar')
let checkMark = document.querySelector('#checkMark').value
// checkMark
const sendMessage = document.querySelector(".send-button")
const messageInput =  document.getElementById('messageInput')
const messages = document.querySelector('#messages')
const createGroup = document.querySelector('.create-group')
const addUsers = document.querySelector('#addUsers')
const selectUsers = document.querySelector('#selectUsers')
const grouupcreation = document.querySelector('#grouupcreation')
const membersDiv = document.querySelector('.members')
const contacts = document.querySelectorAll('.contact')
const bg = document.querySelector('.bg')
let selectedContacts = []
// grouupcreation members
createGroup.addEventListener('click',(event)=>{
    // if (selectUsers.hidden){
        selectUsers.classList.remove('hidden')
        bg.hidden = false
    // }
})
addUsers.addEventListener('click',(event)=>{
    selectUsers.classList.add('hidden')
    grouupcreation.classList.remove('hidden')
})
// addUsers
// <img src="{% static 'main_app/images/remove.png' %}" alt=""  class="icon">
selectUsers.addEventListener('submit',(event) =>{
    event.preventDefault()
    
    for (let contact of contacts){
        if (contact.querySelector('input').checked){
            contact.querySelector('input').remove()
            selectedContacts.push(contact)
            // removeLink
            let img = document.createElement('img')
            img.src = document.querySelector('#removeLink').value
            img.className = 'removeImg'
            img.addEventListener('click', () =>{
                contact.remove()
            })
            contact.append(img)
            membersDiv.append(contact)
        }
    }
        
    
})
// create-group
sendMessage.addEventListener("click", (event)=>{
    let message = messageInput.value
    messageInput.value = ''
    console.log(message)
    socket.send(JSON.stringify({
        'message': message
    }))
})

// <main class="messages">
    //     <p class="my-message">
    //         Привіт! <span class="details-message"> <span class="time">10:01</span> <img src="{% static 'main_app/images/check_mark.png' %}" class="check-mark"> </span>
    //     </p>
    // </main>
// center-message
// chatCard
let socketUrl;
let socket;
let groupPk;

// <li class="contact-item" id="user{{contact.pk}}">
//     {% profile_icon contact.user "contact-avatar" %}
//         <div class="contact-info">
//         <span class="contact-name">{{ contact.user.first_name }} {{ contact.user.last_name }}</span>
//     </div>
// </li>
function messageCreate(){
socketUrl = `ws://${window.location.host}/chat_group/${groupPk}`
socket = new WebSocket(socketUrl)
socket.addEventListener("message", function(event){
    // Перетворюємо повідомлення з json рядка на JS-об'єкт 
    const messageObject  = JSON.parse(event.data)
    // Створюємо html елемент, у якому буде зберігатись отримане повідомлення
    // const messageElem = document.createElement('p')
    // Створюємо новий об'єкт класу "Date" з даними дати у фоматі iso
    let dateTime = new Date(messageObject['date_time'])
    // messages.append(messageElem)
    let p = document.createElement('p')
    let messageContent = document.createElement('span')
    messageContent.className = 'messageContent'
    // messageContent
    let details = document.createElement('span')
    let time = document.createElement('span')
    let img = document.createElement('img')
    p.className = 'my message'
    details.className = 'details-message'
    time.className = 'time'
    
    img.className = 'check-mark'
    time.textContent = `${dateTime.getHours()}:${dateTime.getMinutes()}`
    img.src = checkMark
    
    details.append(time)

    details.append(img)
    messageContent.textContent = messageObject['message']
    messageContent.append(details)
    console.log(!messageObject['you'])
    if (!messageObject['you']){
        let img = document.createElement('img')
        if (messageObject['avatar']){
            img.src = messageObject['avatar']
        }else{
            img.src = document.getElementById('avatarLink').value
        }
        // <span class="username">
        //             {{message.author.username}}
        //         </span>
        let message_data = document.createElement('span')
        message_data.className = 'message-data'
        let username = document.createElement('span')
        username.className = 'username'
        username.textContent = messageObject['username']
        // let messageContent = 
        message_data.append(username)
        message_data.append(messageContent)
        p.append(message_data)
        img.className= 'avatar'
        p.prepend(img)
        p.className = 'message'
    }else{
    
    p.append(messageContent)
    }
    // avatarLink
    messages.prepend(p)
    // <p class="message">
    //         {% profile_icon message.author %}
    //         <!-- <img src="{% static 'main_app/images/Indicator.png' %}" class="avatar" alt="">  -->
    //         <span class="message-data">

    //             <span class="username">
    //                 {{message.author.username}}
    //             </span>
    //             <span class="messageContent">
                    
    //                 {{message.content}} 
    //                 <span class="details-message"> 
    //                     <span class="time">{{ message.send_at.hour }}:{{ message.send_at.minute }}</span> 
    //                     <img src="{% static 'main_app/images/check_mark.png' %}" class="check-mark"> 
    //                 </span>
    //             </span>
    //         </span>
    //     </p>
})
}
let editChat =document.querySelector('.editChat')
editChat.addEventListener('click',()=>{
// user-data-group
    console.log(groupPk)
    $.ajax({
        type: 'post',
        url: document.querySelector('#getLink').value,
        data: {

            csrfmiddlewaretoken:document.querySelector('input').value,
            pk: groupPk
        },
        success: function(request){
            grouupcreation.classList.remove('hidden')
            bg.hidden = false
            console.log(request)
            // changeGroupAvatar
            if (request.avatar){
                
                document.querySelector('#changeGroupAvatar').src = request.avatar
            }
            document.querySelector('#nameGroupInput').value = request.name
            document.querySelector('#groupCreation').value = 'groupEdit'
            document.querySelector('#pkInput').value = groupPk
            // pkInput
            // request = JSON.parse(request)
            // groupCreation
            for (let contact of contacts){
                if (contact.querySelector('#member').value in request.members){
                    contact.querySelector('input').remove()
                    selectedContacts.push(contact)
                    // removeLink
                    let img = document.createElement('img')
                    img.src = document.querySelector('#removeLink').value
                    img.className = 'removeImg'
                    img.addEventListener('click', () =>{
                        contact.remove()
                    })
                    contact.append(img)
                    membersDiv.append(contact)
                }
            }
        }})
})
for (let group of groups){
    group.addEventListener('click',()=>{
        let pk = group.id.split('group').join('')-0
        let icon = group.querySelector('img')
        let name = group.querySelector('.text-group .groupName').textContent
        document.querySelector('.friend-current-name').textContent = name
        currentIcon.src = icon.src
        groupPk = pk
        document.querySelector('.center-message').hidden = true
        document.querySelector('#haederCard').style.display = 'flex'
        document.querySelector('#chatCard').style.display = 'flex'
        $.ajax({
            type: 'post',
            url: window.location.href,
            data: {

                csrfmiddlewaretoken:document.querySelector('input').value,
                pk: pk,
                type:'group'
            },
            success: function(request){
                messages.innerHTML = request
                groupPk = messages.querySelector('#pkInput').value
                let is_admin = document.querySelector('#is_admin').value-0
                let url = document.querySelector('#leaveGroup').value
                // leaveGroup
                console.log(is_admin)
                console.log(document.querySelector('#adminChat'),
                    document.querySelector('#userChat'))
                
                if (!is_admin){
                    document.querySelector('#adminChat').classList.add('hidden')
                    document.querySelector('#userChat').classList.remove('hidden')
                    document.querySelector('.editChat').classList.add('hidden')
                    document.querySelector('dialog').style.height = '7.3490813648vw'
                    // editChat
                }else{
                    // 7.3490813648
                    // 9.23884514432
                    document.querySelector('dialog').style.height = '9.23884514432vw'
                    document.querySelector('.editChat').classList.remove('hidden')
                    document.querySelector('#adminChat').classList.remove('hidden')
                    document.querySelector('#userChat').classList.add('hidden')
                }
                
                let leaveLink = document.querySelector('#leaveLink').value
                leaveLink = leaveLink.split('0').join(`${groupPk}`)
                for (let exitElem of document.querySelectorAll('.exitChat')){
                    exitElem.addEventListener('click', (event) => {
                        $.ajax({
                        type: 'get',
                        url: leaveLink,
                        // data: {

                        //     csrfmiddlewaretoken:document.querySelector('input').value,
                        //     pk: pk,
                        //     type:'group'
                        // },
                        success:function func(){}
                    })
                    })
                }
                // leaveLink
                messageCreate()
            }
        })
    })
}
let ellipsises =document.querySelectorAll(".ellipsis")
for (let ellipsis of ellipsises){
    ellipsis.addEventListener('click', () => {
        for (let object of document.querySelectorAll(`#${ellipsis.id}`)){
            object.classList.toggle("hidden")
        }
    })
}
for (let user of users){
    user.addEventListener('click',()=>{

        // groupName
        let pk = user.id.split('user').join('')-0
        let icon = user.querySelector('img')
        let name = user.querySelector('.contact-info .contact-name').textContent
        document.querySelector('.friend-current-name').textContent = name
        currentIcon.src = icon.src
        groupPk = pk
        document.querySelector('.center-message').hidden = true
        document.querySelector('#haederCard').style.display = 'flex'
        document.querySelector('#chatCard').style.display = 'flex'
        $.ajax({
            type: 'post',
            url: window.location.href,
            data: {

                csrfmiddlewaretoken:document.querySelector('input').value,
                pk: pk,
                type:'personal'},
            success: function(request){
                messages.innerHTML = request
                groupPk = messages.querySelector('#pkInput').value
                messageCreate()
            }
        })
        console.log(groupPk)
        
        // if (socket){

        //     socket.close()
        // }
        
        
        // {}
        
        // chat-card exit-img
        // haederCard
        // icon.remove()
        // icon
    })
}

document.querySelector('.exit-img').addEventListener('click', () => {
    document.querySelector('.center-message').hidden = false
    document.querySelector('#haederCard').style.display = 'none'
    document.querySelector('#chatCard').style.display = 'none'
})
})