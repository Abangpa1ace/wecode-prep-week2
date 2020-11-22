'use strict';

//selectors
const hint = document.querySelector('.hint')
const lifeList = document.querySelectorAll('.life');
const wrongLetter = document.querySelector('.wrong-letter');
const typeCon = document.querySelector('.type-container');
const wrongMsg = document.querySelector('.wrong-msg');
const refresh = document.getElementById('refresh');
const refreshMsg = document.querySelector('.refresh-msg');
const refreshBtn = document.querySelector('.refresh-btn');

// set the topic and list for random
const randomList = {
  topic: 'Fruits',
  list: ['apple', 'banana', 'cherry', 'watermelon', 'peach', 'kiwi', 'grape']
}

hint.innerText = randomList.topic;
let answer = setAnswer(randomList.list).toUpperCase();
let answerLetter = answer.trim().split('');
console.log(answerLetter);
let answerList = [];
let wrongList = [];
let wrongCount = 0;
let typeList = [];

// function for random answer
function setAnswer(list) {
  const res = list[Math.floor(Math.random() * list.length)];
  return res;
}

// set the type container
answerLetter.forEach(ans => {
  const type = document.createElement('span');
  type.innerText = ans;
  type.className = `type ${ans}`;
  answerList.push(type);
  typeCon.appendChild(type);
})

// keydown event listener
window.addEventListener('keydown', (event) => {
  const key = event.keyCode;
  
  if (key < 65 || key > 90) {
    alert('That is not letter key.')
  } 
  else {
    const char = String.fromCharCode(key);

    if (typeList.includes(char)) {
      typeAgain();
    }
    else {
      typeList.push(char);

      if (answerLetter.includes(char)) {
        rightType(char);
      }
      else {
        wrongType(char);
      }
    }
  }
})

// function to display letter (if right)
function rightType(char) {
  //display right letter
  answerList.forEach(span => {
    if (span.classList.contains(char)) {
      span.style.color = 'black';
    }
  })
  //delete from answerletter
  answerLetter.forEach(ans => {
    if (ans === char) {
      const idx = answerLetter.indexOf(ans);
      answerLetter.splice(idx, 1);
    }
  })
  if (answerLetter.length === 0) {
    showRefresh('Clear! 😁');
  }
}

// function to manage wrong condition (if wrong)
function wrongType(char) {
  wrongList.push(char);
  wrongLetter.innerText = wrongList.join(', ');
  lifeList[wrongCount].style.display = 'none';
  wrongCount++;

  if (wrongCount === 6) {
    showRefresh('Game Over! 🤕');
  }
}

// function when wrong type again
function typeAgain() {
  wrongMsg.style.transform = 'translateY(0%)';

  setTimeout(() => {
    wrongMsg.style.transform = 'translateY(100%)';
  }, 3000)
}

// function for refresh
function showRefresh(message) {
  refresh.style.display = 'flex';
  refreshMsg.innerText = message;
  refreshBtn.addEventListener('click', () => {
    location.reload();
  })
}
