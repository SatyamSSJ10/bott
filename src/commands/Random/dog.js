const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class dogCommand extends Command {
	constructor() {
		super('dog', {
			aliases: ['dog', 'woof'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a dog image/gif.',
				usage: 'dog',
			},
		});
	}

	async exec(message) {
		const dog = await neko.sfw.woof();
		const dogEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setImage(dog.url)
			.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
		message.channel.send(dogEmbed);
	}
}

module.exports = dogCommand;
