'use strict';

const podio = require('../podio');
exports.command = 'assigned <assignee>'
exports.aliases = ['A']
exports.desc = 'Retrieve a list of tests currently assigned to someone.'
exports.handler = (argv) => {
	switch(argv.assignee){
		case 'Justin':
			argv.assignee = 'Justin Bushner - justin.bushner@tmmdata.com';
			break;
	} 
	argv.assignee = "assigned-to="+argv.assignee;
  console.log(argv.assignee);
  podio.permissionCheck(podio.READ, podio.getPodioItemsByFilters, [argv.assignee]);
} 
