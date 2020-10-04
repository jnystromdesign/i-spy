import { jsonCopy } from '../utils/Utils';

const outputQuery = (query) => {
	let phrase = '';
	phrase = query.is.length > 0 ? 'Jag ser en sak som är ' + _parseProp(query.is) : '';
	phrase += query.youCan.length > 0 ? ', som du kan ' + _parseProp(query.youCan) + '.' : '';
	phrase += query.youCan.isAlso > 0 ? 'Det kallas även för' + _parseProp(query.isAlso) : '';
	return phrase;
};

const _parseProp = (props) => {
	const localProp = jsonCopy(props);
	const lastProp = localProp.pop();
	if (localProp.length === 0) return lastProp;
	const propList = localProp.length > 1 ? localProp.join(', ') : localProp[0];
	return `${propList} och ${lastProp}`;
};

export default outputQuery;
