module.exports = (podio, args) => {
	if(podio.READ) {
		return podio.getPodioItemsByFilter(`status-2=4. In Sprint`);
	} else {
		return;
	}
}