const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class catCommand extends Command {
	constructor() {
		super('cat', {
			aliases: ['cat', 'meow'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a cat image/gif.',
				usage: 'cat',
			},
		});
	}

	async exec(message) {
		const cat = await neko.sfw.meow();
		const catEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setImage(cat.url)
			.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
		message.channel.send(catEmbed);
	}
}

module.exports = catCommand;
