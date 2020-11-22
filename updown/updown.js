'use strict';

const number = document.querySelector('.number');
const msg = document.querySelector('.msg');
const refresh = document.getElementById('refresh');
const refreshAnswer = document.querySelector('.refresh-answer');
const refreshBtn = document.querySelector('.refresh-btn');

let answerNum = getRandomNum();
// console.log(answerNum);
function getRandomNum() {
  return Math.floor(Math.random() * 100) + 1;
}

//Web speech API
if ('speechSynthesis' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR'
  // recognition.continuous = true;

  function speechRecognition() {
    recognition.onstart = () => {
      // console.log('recording')
      recognition.onresult = (event) => {
        // another way: recognition.addEventListener('result', function);
        
        let transcript = event.results[0][0].transcript;
        let calledNum = parseInt(transcript, 10);
        recognition.stop();
        
        number.innerText = calledNum;
        if (isNaN(calledNum)) {
          msg.innerText = 'Please speak a number.'
        }
        else {
          if (calledNum > 100 || calledNum < 1) {
            msg.innerText = 'Number must be between 1 and 100.'
          }
          else if (calledNum < answerNum) {
            msg.innerText = 'Go Upper!'
          }
          else if (calledNum > answerNum) {
            msg.innerText = 'Go Lower!'
          }
          else if (calledNum === answerNum) {
            msg.innerText = 'Correct!'
            refresh.style.display = 'flex';
            refreshAnswer.innerText = calledNum;
            refreshBtn.addEventListener('click', () => {
              location.reload();
            })
          }
        }
        // speech recognition continuously
        window.requestAnimationFrame(speechRecognition);
        // another way: recognition.addEventListener('end', () => recognition.start());
      }
    };

    recognition.start();
  }
  speechRecognition();
} 
else {alert('Speech recognition is not provided.😅')}
