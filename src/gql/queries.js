import { gql } from '@apollo/client';

const Q_BRICKS = gql`
	query Allbricks {
		allBrick {
			name
			_id
			image {
				asset {
					url
				}
			}
			is {
				name
			}
			youcan {
				name
			}
			synonyme
		}
	}
`;
export { Q_BRICKS };
