function speakText(text) {
	var msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	msg.voice = voices.filter((voice) => voice.lang === 'sv-SE')[0]; // Note: some voices don't support altering params
	msg.voiceURI = 'native';
	msg.volume = 1; // 0 to 1
	msg.rate = 1; // 0.1 to 10
	msg.pitch = 1; //0 to 2
	msg.text = text;
	msg.lang = 'sv-SE';
	// speechSynthesis.speak(msg);
}
export default speakText;
