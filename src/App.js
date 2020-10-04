import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { speakText } from './utils/speakText';
import { Q_BRICKS } from './gql/queries';
import { mockItems } from './data/mockData';
import './App.css';
import Card from './components/Card';
import { Cards } from './styles/Cards';

const client = new ApolloClient({
	uri: 'https://tpptd3gd.api.sanity.io/v1/graphql/production/default',
	cache: new InMemoryCache()
});

function Bricks() {
	const { loading, error, data } = useQuery(Q_BRICKS);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;
	console.log(data);
	return data.allBrick.map(({ name, _id }) => (
		<div key={_id}>
			<p>{name}</p>
		</div>
	));
}

function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

const items = mockItems;

class App extends Component {
	constructor(props) {
		super(props);
		this.getSelectQuery = this.getSelectQuery.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.tryQuery = this.tryQuery.bind(this);
		this.state = { items, query: this.getSelectQuery(), hasPlayedIntitialMessage: false };
	}
	/**
   * Selects a random item from the current items at hand
   * and construct a hint query for it
   */
	getSelectQuery = () => {
		const randomItem = Math.floor(Math.random() * items.length);
		const query = this.constructQuery(items[randomItem], items);
		return query;
	};

	/**
   * Should return true if only one match exists
   * @param items
   * @param query
   */
	tryQuery(items, query) {
		let matches = 0; // items

		// Each item available
		for (let item of items) {
			if (this.testItem(item, query)) {
				matches++;
			}
		}
		return matches;
	}

	testItem(item, query) {
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
	}

	/**
   * Takes an item an extracts a few parameters and then tries it
   * as long as we are returning more than one result we will add
   * properties.
   *
   * @param item
   */
	constructQuery(item, items) {
		let query = { is: [], youCan: [], isAlso: [] };
		let metaItem = jsonCopy(item.props); // Create an item we can "pick" props from
		let result = 2;
		while (result > 1) {
			query = this.populateProps(query, metaItem);
			result = this.tryQuery(items, query);
		}
		query.id = item.title;
		return query;
	}

	populateProps(query, metaItem) {
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
	}

	parseProp(props) {
		const localProp = jsonCopy(props);
		const lastProp = localProp.pop();
		if (localProp.length === 0) return lastProp;
		const propList = localProp.length > 1 ? localProp.join(', ') : localProp[0];
		return `${propList} och ${lastProp}`;
	}

	outputQuery() {
		const query = this.state.query;
		let phrase = '';
		phrase = query.is.length > 0 ? 'Jag ser en sak som är ' + this.parseProp(query.is) : '';
		phrase += query.youCan.length > 0 ? ', som du kan ' + this.parseProp(query.youCan) + '.' : '';
		phrase += query.youCan.isAlso > 0 ? 'Det kallas även för' + this.parseProp(query.isAlso) : '';
		return phrase;
	}

	componentDidMount() {
		if (!this.state.hasPlayedIntitialMessage) {
			speakText('Väl-kommen. Klicka på det du tror jag tittar på.   ' + this.outputQuery());
			this.setState({ hasPlayedIntitialMessage: true });
		}
	}
	checkAnswer = (id) => {
		if (this.state.query.id === id) {
			this.onRightAnswer();
		} else {
			this.onWrongAnswer();
		}
	};

	resetGame = () => {
		this.setState({ mood: null, query: this.getSelectQuery() });
		setTimeout(function() {
			speakText('Gissa vad jag tittar på.  ' + this.outputQuery());
		}, 500);
	};

	onRightAnswer = () => {
		this.setState({ mood: 'success' });
		speakText('Rätt!');
		setTimeout(this.resetGame, 1000);
	};

	onWrongAnswer = () => {
		this.setState({ mood: 'fail' });
		speakText('Inte riktigt rätt. ' + this.outputQuery());
	};

	renderCards = (items) => {
		return items.map((item) => <Card onCardClick={() => this.checkAnswer(item.id)} key={item.id} {...item} />);
	};

	render() {
		return (
			<div className="App">
				<ApolloProvider client={client}>
					<Bricks />
				</ApolloProvider>
				<Cards mood={this.state.mood}>{this.renderCards(this.state.items)}</Cards>
				<div>{this.outputQuery()}</div>
			</div>
		);
	}
}

export default App;
