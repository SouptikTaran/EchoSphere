document.querySelector('.chat[data-chat=person2]').classList.add('active-chat')
document.querySelector('.person[data-chat=person2]').classList.add('active')

const chatRight = document.querySelector('.right');
chatRight.classList.add('blank'); 

let friends = {
    list: document.querySelector('ul.people'),
    all: document.querySelectorAll('.left .person'),
    name: ''
  },
  chat = {
    container: document.querySelector('.container .right'),
    current: null,
    person: null,
    name: document.querySelector('.container .right .top .name')
  }

friends.all.forEach(f => {
  f.addEventListener('mousedown', () => {
    f.classList.contains('active') || setAciveChat(f)
  })
});

function setAciveChat(f) {
  friends.list.querySelector('.active').classList.remove('active')
  f.classList.add('active')
  chat.current = chat.container.querySelector('.active-chat')
  chat.person = f.getAttribute('data-chat')
  chat.current.classList.remove('active-chat')
  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat')
  friends.name = f.querySelector('.name').innerText
  chat.name.innerHTML = friends.name
}




//....

friends.all.forEach(f => {
  f.addEventListener('mousedown', () => {
    f.classList.contains('active') || setActiveChat(f);

    const imageElement = f.querySelector('img');
  if (imageElement) {
    const chatImage = imageElement.src;
    updateChatImage(chatImage);
  } else {
    console.warn("Friend element doesn't have an image.");
  }

  // Remove the blank class after updating the chat content
  chatRight.classList.remove('blank');

  });
});

function updateChatImage(imageUrl) {
  // Select the right chat container and its image element
  const chatRight = document.querySelector('.right');
  const chatImageRight = chatRight.querySelector('.top img.image');

  // Update the image source in the right chat container
  chatImageRight.src = imageUrl;
}


