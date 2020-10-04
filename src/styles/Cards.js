import styled from 'styled-components';
export const Cards = styled.div`
	background-color: ${(props) => (props.mood === 'success' ? 'lime' : props.mood === 'fail' ? 'pink' : '')};
	display: grid;
	grid-gap: 10px;
	grid-template-columns: 1fr 1fr 1fr;
	padding: 50px;
`;
