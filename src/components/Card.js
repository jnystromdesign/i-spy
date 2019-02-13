import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  background-color: #fff;
  transition: all 200ms;
  padding: 5px;
  min-width: 100px;
  box-shadow: -2px 2px 0px rgba(0,0,0, 0.1);
  border: 1px solid #eee;
  border-radius: 3px;
  z-index: 1;
  position: relative;
  display: flex; 
  justify-content: center;
  align-items: center;
  &:hover{
   box-shadow: -3px 3px 3px rgba(0,0,0, 0.1);
   transform: translateY(-2%) rotate(-2deg);
   cursor: pointer;
   z-index: 2;
  }
`;
const CardImage = styled.img`
  max-width: 100%;
  
`;
const Card = (props) => {

    return (
        <Root onClick={props.onCardClick} >
            <CardImage src={`/${props.img}`} alt={props.title}/>
        </Root>
    );
};

export default Card;
