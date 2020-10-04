import { createPlaceholderObject } from '../utils/createPlaceholderObject';
const mockItems = [
	createPlaceholderObject('Apple', { is: [ 'röd', 'rund' ], youCan: [ 'äta' ], isAlso: [ 'en frukt' ] }),
	createPlaceholderObject('Car', { is: [ 'orange' ], youCan: [ 'köra', 'sitta i' ], isAlso: [ 'ett fordon' ] }),
	createPlaceholderObject('Dog', {
		is: [ 'brun', 'hårig' ],
		youCan: [ 'klappa', 'leka med' ],
		isAlso: [ 'ett djur' ]
	}),
	createPlaceholderObject('Orange', { is: [ 'orange', 'rund' ], youCan: [ 'äta' ], isAlso: [ 'en frukt' ] }),
	createPlaceholderObject('Horse', {
		is: [ 'brun', 'hårig' ],
		youCan: [ 'sitta på', 'rida på' ],
		isAlso: [ 'ett djur' ]
	}),
	createPlaceholderObject('Ball', { is: [ 'röd', 'rund' ], youCan: [ 'leka med', 'studsa' ], isAlso: [ 'leksak' ] }),
	createPlaceholderObject('Pokeball', {
		is: [ 'röd och vit', 'rund' ],
		youCan: [ 'leka med', 'fånga pokemons' ],
		isAlso: [ 'leksak' ]
	}),
	createPlaceholderObject('Fatolj', { is: [ 'röd' ], youCan: [ 'sitta i' ], isAlso: [ 'möbel' ] }),
	createPlaceholderObject('Jordgubbe', {
		is: [ 'röd', 'liten' ],
		youCan: [ 'äta', 'koka sylt på' ],
		isAlso: [ 'bär' ]
	})
];
export { mockItems };
