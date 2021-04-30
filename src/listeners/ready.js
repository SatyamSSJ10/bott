const { Listener } = require('discord-akairo');
class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	exec() {
		console.log("I'm ready!");
    this.client.user.setActivity('3 weeks until permament shutdown.', {
			type: 'WATCHING',
		});
	}
}

module.exports = ReadyListener;
