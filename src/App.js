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
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr; 
  padding: 50px;
`;

class App extends Component {
  constructor(props){
    super(props);
    this.tryQuery = this.tryQuery.bind(this);

    const items = [
      createPlaceholderObject('Apple',  {is: ['red', 'round',], youCan: ['eat'], isAlso: ['a fruit']}),
      createPlaceholderObject('Car',    {is: ['orange'], youCan: ['drive', 'sit in'], isAlso: ['a vehicel']}),
      createPlaceholderObject('Dog',    {is: ['brown', 'furry'], youCan: ['pet', 'play fetch with'], isAlso: ['an animal']}),
      createPlaceholderObject('Orange', {is: ['orange', 'round'], youCan: ['eat'], isAlso: ['a fruit']}),
      createPlaceholderObject('Horse',  {is: ['brown', 'furry'], youCan: ['sit on', 'ride somewhere with'], isAlso: ['an animal']}),
      createPlaceholderObject('Ball',  {is: ['red', 'round'], youCan: ['play with', 'bounce'], isAlso: ['toy']}),
    ];
    const randomItem = Math.floor(Math.random() * items.length);
    const query = this.constructQuery(items[randomItem], items);
    this.state = {query, items};
  }

  renderCards = (items) =>{
    return items.map(item => <Card onCardClick={()=>this.checkAnswer(item.id)} key={item.id} {...item} />)
  }

  checkAnswer = (id) =>{
    console.log(this.state.query.id === id);
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
    const lastProp = props.pop();
    if(props.length === 0) return lastProp;
    const propList = props.length > 1 ? props.join(', ') : props[0];
    return `${propList} and ${lastProp}`;
  }

  outputQuery(query){
    let phrase = '';
    phrase = query.is.length > 0 ? 'I spy somthing that is ' + this.parseProp(query.is) : '';
    phrase += query.youCan.length > 0 ? ', which you can ' + this.parseProp(query.youCan) + '.': '';
    phrase += query.youCan.isAlso> 0 ? 'This is also called' + this.parseProp(query.isAlso) : '';
    return phrase;
  }

  
  render() {

    
    return (
      <div className="App">
        <Cards>
         {this.renderCards(this.state.items)}
        </Cards>
        <div>{this.outputQuery(this.state.query)}</div>
      </div>
    );
  }
}

export default App;
