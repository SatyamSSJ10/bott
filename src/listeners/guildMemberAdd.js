const { Listener } = require('discord-akairo');
const Discord = require('discord.js');

class GuildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd',
		});
	}
	exec(member) {}
}

module.exports = GuildMemberAddListener;
