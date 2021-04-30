const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class PatCommand extends Command {
	constructor() {
		super('pat', {
			aliases: ['pat'],
			category: 'Social',
			args: [
				{
					id: 'member',
					type: 'memberMention',
					default: (message) => message.member,
				},
			],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Pat a user.',
				usage: 'pat <user>',
			},
		});
	}

	async exec(message, args) {
		const Pat = await neko.sfw.pat();
		if (args.member.id !== message.author.id) {
			const userToPatEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} is patting ${args.member.user.username}!`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Pat.url,
				)
				.setImage(Pat.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(userToPatEmbed);
		} else {
			const PatEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} is patting themselves, I don't know what to say.`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Pat.url,
				)
				.setImage(Pat.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(PatEmbed);
		}
	}
}

module.exports = PatCommand;
