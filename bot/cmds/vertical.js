'use strict';

const podio = require('../podio');
exports.command = 'vertical <vertical>'
exports.aliases = ['V','vert']
exports.desc = 'Retrieve a list of tests currently in sprint.'
exports.handler = (argv) => {
	switch(argv.vertical){
		case 'Brett':
		case 'brett':
		case 'busi':
		case 'bsee':
			argv.vertical = 'Brett Schultz - BSEE & BCP';
			break;
		case 'Minh':
		case 'minh':
		case 'offers and merchandising':
		case 'offers':
			argv.vertical = 'Minh Thai - Offers and Merchandising';
			break;
		case 'Tony':
		case 'tony':
		case 'account':
		case 'account management':
		case 'my account':
			argv.vertical = 'Tony Monterosso - Account Management';
			break;
		case 'Lifecycle':
			argv.veritcal = 'Customer Lifecycle';
			break;
	}
	argv.vertical = "vertical-2="+argv.vertical;
	podio.permissionCheck(podio.READ, podio.getPodioItemsByFilters, [argv.vertical]);
}
