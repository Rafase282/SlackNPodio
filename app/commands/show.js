module.exports = (podio, args) => {
	if(podio.READ) {
		return podio.showAllFields(args[0]);
	} else {
		return;
	}
}
