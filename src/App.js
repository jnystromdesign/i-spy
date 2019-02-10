import React, { Component } from 'react';
import Card from './components/Card'
import './App.css';
import styled from 'styled-components'

function createPlaceholderObject(title, props){
  const {is, youCan, isAlso} = {...props}
  return {
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
  }
  renderCards = (items) =>{
    return items.map(item => <Card key={item.title} {...item} />)
  };

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

  
  render() {
    const items = [
      createPlaceholderObject('Apple',  {is: ['red', 'round',], youCan: ['eat it'], isAlso: ['a fruit']}),
      createPlaceholderObject('Car',    {is: ['orange', 'shiny'], youCan: ['drive it', 'sit in it'], isAlso: ['a vehicel']}),
      createPlaceholderObject('Dog',    {is: ['brown', 'furry'], youCan: ['pet it', 'play fetch with it'], isAlso: ['an animal']}),
      createPlaceholderObject('Orange', {is: ['orange', 'round'], youCan: ['eat it'], isAlso: ['a fruit']}),
      createPlaceholderObject('Horse',  {is: ['brown', 'furry'], youCan: ['sit on it', 'ride somewhere with it'], isAlso: ['an animal']}),
      createPlaceholderObject('Ball',  {is: ['red', 'round'], youCan: ['play with it', 'bounce it'], isAlso: ['toy']}),
    ];

    const query = this.constructQuery(items[0], items);
    console.log(query);
    
    return (
      <div className="App">
        <Cards>
         {this.renderCards(items)}
        </Cards>
      </div>
    );
  }
}

export default App;
