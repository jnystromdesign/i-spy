function createPlaceholderObject(title, props) {
	const { is, youCan, isAlso } = { ...props };
	return {
		id: title,
		title,
		img: `images/${title.toLowerCase()}.jpg`,
		props: {
			is,
			youCan,
			isAlso
		}
	};
}
export { createPlaceholderObject };
