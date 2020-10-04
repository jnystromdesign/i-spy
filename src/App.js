import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { speakText } from './utils/Utils';
import { Q_BRICKS } from './gql/queries';
import { mockItems } from './data/mockData';
import './App.css';
import Card from './components/Card';
import { Cards } from './styles/Cards';
import getSelectQuery, { testItem } from './data/getSelectQuery';
import outputQuery from './data/outputQuery';

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

const items = mockItems;

class App extends Component {
	constructor(props) {
		super(props);
		this.resetGame = this.resetGame.bind(this);
		this.state = { items, query: getSelectQuery(items), hasPlayedIntitialMessage: false };
	}

	componentDidMount() {
		if (!this.state.hasPlayedIntitialMessage) {
			speakText('Väl-kommen. Klicka på det du tror jag tittar på.   ' + outputQuery(this.state.query));
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

	onRightAnswer = () => {
		this.setState({ mood: 'success' });
		speakText('Rätt!');
		setTimeout(this.resetGame, 1000);
	};

	onWrongAnswer = () => {
		this.setState({ mood: 'fail' });
		speakText('Inte riktigt rätt. ' + outputQuery(this.state.query));
	};

	resetGame = () => {
		this.setState({ mood: null, query: this.getSelectQuery() });
		setTimeout(function() {
			speakText('Gissa vad jag tittar på.  ' + outputQuery(this.state.query));
		}, 500);
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
				<div>{outputQuery(this.state.query)}</div>
			</div>
		);
	}
}

export default App;
