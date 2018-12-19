module.exports = (podio, args) => {
	if(podio.READ) {
		return podio.getItemsList(args[0]);
	} else {
		return;
	}
}
