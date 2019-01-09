module.exports = (podio, args) => {
	if(podio.READ) {
		return podio.getItemsList(args.join(' '));
	} else {
		return;
	}
}
