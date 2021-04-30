const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class SmugCommand extends Command {
	constructor() {
		super('smug', {
			aliases: ['smug'],
			args: [
				{
					id: 'member',
					type: 'memberMention',
				},
			],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Smug to a user.',
				usage: 'smug <user>',
			},
		});
	}

	async exec(message, args) {
		const Smug = await neko.sfw.smug();
		if (args.member) {
			const SmugAtEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} smugs at ${args.member.user.username}.`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Smug.url,
				)
				.setImage(Smug.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(SmugAtEmbed);
		} else {
			const SmugEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} Smugs.`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Smug.url,
				)
				.setImage(Smug.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(SmugEmbed);
		}
	}
}

module.exports = SmugCommand;
