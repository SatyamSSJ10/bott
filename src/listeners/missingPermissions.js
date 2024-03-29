const { Listener } = require('discord-akairo');
const Discord = require('discord.js');

class MissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
		});
	}

	exec(message) {
		const checkPermsEmbed = new Discord.MessageEmbed()
			.setColor(29128)
			.setDescription(
				"I can't do that with the permissions I have at the moment.",
			);
		message.channel.send(checkPermsEmbed).then((msg) => {
			msg.delete({ timeout: 5000 });
		});
	}
}

module.exports = MissingPermissionsListener;
