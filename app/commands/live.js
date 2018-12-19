module.exports = (podio, args) => {
	if(podio.READ) {
		return podio.getPodioItemsByFilter(`status-2=6. Live`);
	} else {
		return;
	}
}