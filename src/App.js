import React, { Component } from 'react';
import Card from './components/Card'
import './App.css';
import styled from 'styled-components'

function createPlaceholderObject(title, props){
  const {is, youCan, isAlso} = {...props}
  return {
    id: title,
    title,
    img: `images/${title.toLowerCase()}.jpg`,
    props: {
      is,
      youCan,
      isAlso
    }
  }
}

function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}

const Cards = styled.div`
  background-color: ${props => props.mood === 'success' ? 'lime': props.mood === 'fail' ? 'pink' : ''};
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr; 
  padding: 50px;
`;

const items = [
  createPlaceholderObject('Apple',  {is: ['röd', 'rund',], youCan: ['äta'], isAlso: ['en frukt']}),
  createPlaceholderObject('Car',    {is: ['orange'], youCan: ['köta', 'sitta i'], isAlso: ['ett fordon']}),
  createPlaceholderObject('Dog',    {is: ['brun', 'hårig'], youCan: ['klappa', 'kasta apport med'], isAlso: ['ett djur']}),
  createPlaceholderObject('Orange', {is: ['orange', 'rund'], youCan: ['äta'], isAlso: ['en frukt']}),
  createPlaceholderObject('Horse',  {is: ['brun', 'hårig'], youCan: ['sitta på', 'rida någonstans'], isAlso: ['ett djur']}),
  createPlaceholderObject('Ball',  {is: ['röd', 'rund'], youCan: ['leka med', 'studsa'], isAlso: ['leksak']}),
];

class App extends Component {

  constructor(props){
    super(props);
    this.getSelectQuery = this.getSelectQuery.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.tryQuery = this.tryQuery.bind(this);
    this.state = {items, query: this.getSelectQuery()};
  }

  getSelectQuery = () => {
    const randomItem = Math.floor(Math.random() * items.length);
    const query = this.constructQuery(items[randomItem], items);
    return query;
  }

  getNewSelectQuery(){

    if(this.state && this.state.query){
      const oldId = this.state.query.id;
      let newQuery = this.getSelectQuery();
      while(newQuery.id === oldId){
        newQuery = this.getSelectQuery();
      }
      return newQuery;
    }else{
      return this.getSelectQuery();
    }
  }

  renderCards = (items) =>{
    return items.map(item => <Card onCardClick={()=>this.checkAnswer(item.id)} key={item.id} {...item} />)
  }

  checkAnswer = (id) =>{
    if(this.state.query.id === id){
      this.onRightAnswer();
    }else{
      this.onWrongAnswer();
    }
  }
  
  resetGame = () => {
    this.setState({mood: null, query: this.getSelectQuery() });
  }
  
  onRightAnswer = () =>{
    this.setState({mood: 'success'});
    setTimeout(this.resetGame, 1000);
  }

  onWrongAnswer = () =>{
    this.setState({mood: 'fail'});
  }

  /**
   * Should return true if only one match exists
   * @param items
   * @param query
   */
  tryQuery(items, query){
    let matches = 0; // items

    // Each item available
    for(let item of items){
      if(this.testItem(item, query)) {
        matches++;
      }
    }
    return matches;
  }
  
  testItem(item, query){

    const itemProp = item.props;
    let success = true;

    // Test every prop from query on item
    for(let taxonomy in query){
      let queryProp = query[taxonomy];

      // Extract all properties
      for(let i = 0; queryProp.length > i; i++ ){
        let queryPropValue = queryProp[i];

        // test if the property value is in the correspending place in the query
        if(item.props[taxonomy].indexOf(queryPropValue) === -1) success = false;
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
  constructQuery(item, items){
    let query = {is: [], youCan: [], isAlso: []};
    let metaItem = jsonCopy(item.props); // Create an item we can "pick" props from
    let result = 2;
    while(result > 1){
      query = this.populateProps(query, metaItem);
      result = this.tryQuery(items, query);
    }
    query.id = item.title;
    return query;
  }

  populateProps(query, metaItem){
    // Ripple down the props
    if(metaItem['is'].length > 0){
      query.is.push(metaItem.is.pop());
    }else if(metaItem.youCan.length > 0){
      query.youCan.push(metaItem['youCan'].pop());
    }else if(metaItem['isAlso'].length > 0){
      query.isAlso.push(metaItem.isAlso.pop());
    }else{
      console.error('Query ran out of arguments, propabley the DB has duplicates')
    }

    return query;
  }

  parseProp(props){
    const localProp = jsonCopy(props);
    const lastProp = localProp.pop();
    if(localProp.length === 0) return lastProp;
    const propList = localProp.length > 1 ? localProp.join(', ') : localProp[0];
    return `${propList} och ${lastProp}`;
  }

  outputQuery(){
    const query = this.state.query;
    let phrase = '';
    phrase = query.is.length > 0 ? 'Jag ser en sak som är ' + this.parseProp(query.is) : '';
    phrase += query.youCan.length > 0 ? ', som du kan ' + this.parseProp(query.youCan) + '.': '';
    phrase += query.youCan.isAlso> 0 ? 'Det kallas även för' + this.parseProp(query.isAlso) : '';
    return phrase;
  }

  
  render() {
    return (
      <div className="App">
        <Cards mood={this.state.mood}>
         {this.renderCards(this.state.items)}
        </Cards>
        <div>{this.outputQuery()}</div>
      </div>
    );
  }
}

export default App;
