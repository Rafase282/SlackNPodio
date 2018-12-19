module.exports = (podio, args) => {
	if(podio.READ) {
		return `*SlacknPodio Usage:*

		Allows team members to interact with data from Podio by using commands within a Slack channel.
		Any team member can easily retrieve information, or make updates without ever opening a browser.
		Even team members without a Podio account now have the ability to interact with Podio right from within a Slack channel.
	
		*Synopsis*
	
			\`ab-testbot [options]\`
	
	*Commands*
	
		\`ab-testbot search <keyword>\` will search all tests and return Title - URL which include keyword
		\`ab-testbot show <unique keyword>\` will show details for a test (must be specific to one test)
		\`ab-testbot queue\` will show all tests currently in sprint
		\`ab-testbot live\` will show all tests currently live
		\`ab-testbot vertical <vertical>\` will show all latest tests assigned to team member
					accepts: Brett|Minh|Tony|Acquisition|Lifecycle
		`;
	}
	
}
