import speakText from './speakText';
function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}
export { jsonCopy, speakText };
