const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class HugCommand extends Command {
	constructor() {
		super('hug', {
			aliases: ['hug'],
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
				description: 'Hug a user.',
				usage: 'hug <user>',
			},
		});
	}

	async exec(message, args) {
		const hug = await neko.sfw.hug();
		if (args.member.id !== message.author.id) {
			const userTohugEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} hugs ${args.member.user.username}!`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					hug.url,
				)
				.setImage(hug.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(userTohugEmbed);
		} else {
			const hugEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} hugs themselves, I don't know how-`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					hug.url,
				)
				.setImage(hug.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(hugEmbed);
		}
	}
}

module.exports = HugCommand;
