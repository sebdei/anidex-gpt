const DEFAULT_LANG = 'de-DE'

export function synthesisText(text, lang = DEFAULT_LANG) {
  const speechSynthesisUtterance = new SpeechSynthesisUtterance()

  speechSynthesisUtterance.text = text
  speechSynthesisUtterance.lang = lang
  speechSynthesisUtterance.rate = 1.05

  window.speechSynthesis.speak(speechSynthesisUtterance);
}
