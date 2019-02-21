module.exports = (podio, args) => {
	let vertical = args[0];
	switch(args[0]) {
		case 'Brett':
		case 'brett':
		case 'busi':
		case 'bsee':
			vertical = 'Brett Schultz - BSEE & BCP';
			break;

		case 'Minh':
		case 'minh':
		case 'offers and merchandising':
		case 'offers':
			vertical = 'Minh Thai - Offers and Merchandising';
			break;

		case 'Tony':
		case 'tony':
		case 'account':
		case 'account management':
		case 'my account':
			vertical = 'Tony Monterosso - Account Management';
			break;

		case 'Lifecycle':
			vertical = 'Customer Lifecycle';
			break;
	}
	if(podio.READ) {
		return podio.getPodioItemsByFilter(`vertical-2=${vertical}`);
	} else {
		return;
	}
	
}
