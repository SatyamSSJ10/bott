const Discord = require('discord.js');
const { Command } = require('discord-akairo');
const Neko = require('neko-love');
const client = new Neko.Client();
class CryCommand extends Command {
	constructor() {
		super('cry', {
			aliases: ['cry'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a crying image/gif.',
				usage: 'cry',
			},
		});
	}
	async exec(message) {
		client.cry().then((url) => {
			const cryEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setImage(url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(cryEmbed);
		});
	}
}

module.exports = CryCommand;
