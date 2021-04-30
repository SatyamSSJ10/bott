const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BotInfoCommand extends Command {
	constructor() {
		super('botinfo', {
			aliases: ['botinfo', 'binfo', 'bi', 'info'],
			ownerOnly: false,
			category: 'Info',
			description: {
				description: 'Sends information about the Bot.',
				usage: 'botinfo',
			},
		});
	}

	exec(message) {
		const zyla = this.client.users.cache.find(
			(u) => u.id === '488699894023061516',
		);
		const botInfoEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setTitle('Who am I?')
			.setDescription(
				`Hello, my name is Great Sage and I am a bot made for Hidden Dungeon Discord Server. I am being worked on all the time by **${zyla}** so if there is anything that I could be better at please inform my programmer!`,
			)
			.setThumbnail(
				`${this.client.guilds.cache
					.find((g) => g.id === '796208075434360832')
					.iconURL({ dynamic: true, size: 256 })}`,
			)
			.addFields(
				{ name: 'Programming Language Used:', value: ' JavaScript' },
				{ name: 'Framework Used:', value: ' discord-akairo v8.1.0' },
				{ name: 'Discord.js Version:', value: ' 12.5.1' },
				{ name: 'Node version:', value: ' v14.15.4' },
				{ name: 'Prefix:', value: ` ${this.client.commandHandler.prefix}` },
				{ name: 'Ping:', value: ` ${this.client.ws.ping}` },
			)
			.setFooter(
				`Programmer: ${zyla.username}`,
				`${zyla.displayAvatarURL({ dynamic: true })}`,
			);
		message.channel.send(botInfoEmbed);
	}
}

module.exports = BotInfoCommand;
