'use strict';

const number = document.querySelector('.number');
const msg = document.querySelector('.msg');

//Web speech API
if ('speechSynthesis' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onstart = () => {
    console.log('recording...')
  }

  recognition.onspeechend = () => {
    recognition.stop();
  }

  recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript;
  };

  recognition.start();
  
} else {alert('Speech recognition is not provided.😅')}

