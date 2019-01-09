'use strict';


const Podio = require('podio-js').api;
const helper = require('./helper');

const podio = new Podio({
	authType: 'app',
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret
});

console.log(process.env.clientSecret);

module.exports = {
	podioAuthenticated: false,
	WRITE: process.env.WRITE == 'TRUE',
	READ: process.env.READ == 'TRUE'
}

let getPodioItem = module.exports.getPodioItem = (name) => {
	const data = {
		'sort_by': 'title',
		'sort_desc': true,
		'filters': {
				title: name
		},
		'limit': 30,
		'offset': 0,
		'remember': false
	}
	return podio.request('POST', `/item/app/${process.env.appID}/filter/`, data)
		.then((res) => res.items[0]);
}

module.exports.getPodioItemsByFilter = (filters) => {

	return new Promise((resolve, reject) => {
		const filter = {
			"sort_by": 'title',
			"sort_desc": false,
			"state": 'active',
			"limit": 500,
			"offset": 0,
			"remember": false
		};

		let getItems = (items) => {
			return podio.request('POST', `/item/app/${process.env.appID}/filter/`, filter)
      	.then((res) => {
					items = [...items, ...res.items];
					if(res.items.length == filter.limit) {
						filter.offset += filter.limit;
						return getItems(items);
					} else {
						return items;
					}
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		}

		getItems([]).then((items) => {
			let filter_item = helper.filterItems(filters, items);
			resolve(helper.listItems(filter_item));
		});
	});
}

let getPodioItems = module.exports.getPodioItems = (query = 'name', limit = 50, search_fields = 'title', counts = true, highlights = false, offset = 0, ref_type = 'item') => {
	return podio.request('GET', `/search/app/${process.env.appID}/v2/`, {
		'query': query,
		'limit': limit,
		'search_fields': search_fields,
		'counts': counts,
		'highlights': highlights,
		'offset': offset,
		'ref_type': ref_type
	});
}

let getPodioItemValues = module.exports.getPodioItemValues = (itemId) => {
	return podio.request('GET', `/item/${itemId}/value/v2/`);
}

module.exports.getItemsList = (name) => {
	return new Promise((resolve, reject) => {
		getPodioItems(name, 50, 'title', true, true, 0, 'item')
		.then((res) => {
			let items = res.results
				.filter(item => item.title.includes(name))
				.reverse()
			if(Object.keys(items).length == 1) {
				resolve(showAllFields(name));
			} else {
				resolve(helper.listItems(items, false));
			}
		});
	})
}

module.exports.authenticatePodio = (callback, errorCallback) => {
	return podio.authenticateWithApp(process.env.appID, process.env.appToken, (err) => {
			if (err) errorCallback(err);
			podio.isAuthenticated().then(() => {
					callback();
			}).catch((err) => {
					errorCallback(err);
			});
	});
}

module.exports.setValue = (item, name, value) => {
	return getPodioItem(item).then((itemObj) => {
			const options = itemObj.fields[1].config.settings.options;
			const item_id = app.helper.getItemID(itemObj);
			let fieldID = value;
			let data = {};
			if (name === 'Category' || name === 'category') {
					fieldID = app.helper.getFieldValueID(options, value);
					data = {
							'category': [fieldID]
					};
			}
			data[name.toLowerCase()] = fieldID;
			return podio.request('PUT', `/item/${item_id}/value/`, data).then(() => {
					return `Item: ${item}, Field: ${name}, Value set to: ${value}`;
			});
	});
}

let showAllFields = module.exports.showAllFields = (query) => {
	return new Promise((resolve, reject) => {
		getPodioItems(query, 50, 'title', true, true, 0, 'item')
		.then((t_res) =>  {
			console.log(t_res.results[0]);
			let items = t_res.results
				.map(item => {
					return item;
				})
				.filter(item => item.title.includes(query))
				.reverse()
			let itemsCount = Object.keys(items).length;
			if(itemsCount>1) {
			resolve(`Multiple items match this keyword, please refine search to be more unique.`);
			} else {
			getPodioItem(items[0].title)
				.then((res) => {
					let output = `*Item:* ${res.title}\n*Link:* ${res.link}\n\n`;
					getPodioItemValues(res.item_id).then((res) => {
						resolve(output += helper.listAllFields(res));
						})
						.catch((err) => resolve(`${err}`));
				})
				.catch(() => {
					resolve(`I'm sorry, I couldn't find an item by that *title*, please make sure you have the *exact* item title.`);
				});
			}
		})
		.catch((err) => {
			resolve(`an error occured ${err}`);
		});
	});
}