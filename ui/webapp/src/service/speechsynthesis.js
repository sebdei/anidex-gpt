export function synthesisText(text) {
  const speechSynthesisUtterance = new SpeechSynthesisUtterance()

  speechSynthesisUtterance.text = text
  speechSynthesisUtterance.lang = 'DE-de'
  speechSynthesisUtterance.rate = 1

  const voice = findGoogleVoice()

  if (voice) {
    speechSynthesisUtterance.voice = voice
  }

  window.speechSynthesis.speak(speechSynthesisUtterance);
}

function findGoogleVoice() {
  return window.speechSynthesis.getVoices().find(voice => voice.name === 'Google Deutsch');
}
