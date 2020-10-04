import { jsonCopy } from '../utils/Utils';
/**
 * Selects a random item from the current items at hand
 * and construct a hint query for it
 */
const getSelectQuery = (items) => {
	const randomItem = Math.floor(Math.random() * items.length);
	const query = _constructQuery(items[randomItem], items);
	return query;
};
export default getSelectQuery;

/**
* Takes an item an extracts a few parameters and then tries it
* as long as we are returning more than one result we will add
* properties.
*
* @param item
*/
const _constructQuery = (item, items) => {
	let query = { is: [], youCan: [], isAlso: [] };
	let metaItem = jsonCopy(item.props); // Create an item we can "pick" props from
	let result = 2;
	while (result > 1) {
		query = _populateProps(query, metaItem);
		result = _tryQuery(items, query);
	}
	query.id = item.title;
	return query;
};
/**
* Populate with props from the meta item 
* 
* @param {String} query 
* @param {Object} metaItem 
*/
const _populateProps = (query, metaItem) => {
	// Ripple down the props
	if (metaItem['is'].length > 0) {
		query.is.push(metaItem.is.pop());
	} else if (metaItem.youCan.length > 0) {
		query.youCan.push(metaItem['youCan'].pop());
	} else if (metaItem['isAlso'].length > 0) {
		query.isAlso.push(metaItem.isAlso.pop());
	} else {
		console.error('Query ran out of arguments, propabley the DB has duplicates');
	}

	return query;
};

/**
* Should return true if only one match exists
* @param items
* @param query
*/
const _tryQuery = (items, query) => {
	let matches = 0; // items

	// Each item available
	for (let item of items) {
		if (testItem(item, query)) {
			matches++;
		}
	}
	return matches;
};

const testItem = (item, query) => {
	let success = true;

	// Test every prop from query on item
	for (let taxonomy in query) {
		let queryProp = query[taxonomy];

		// Extract all properties
		for (let i = 0; queryProp.length > i; i++) {
			let queryPropValue = queryProp[i];

			// test if the property value is in the correspending place in the query
			if (item.props[taxonomy].indexOf(queryPropValue) === -1) success = false;
		}
	}

	return success;
};
export { testItem };
