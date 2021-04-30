const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class SlapCommand extends Command {
	constructor() {
		super('slap', {
			aliases: ['slap'],
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
				description: 'Slap a user.',
				usage: 'slap <user>',
			},
		});
	}

	async exec(message, args) {
		const Slap = await neko.sfw.slap();
		if (args.member.id !== message.author.id) {
			const userToSlapEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} slaps ${args.member.user.username}!`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Slap.url,
				)
				.setImage(Slap.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(userToSlapEmbed);
		} else {
			const SlapEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} slaps themselves, I hope they get better soon-`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Slap.url,
				)
				.setImage(Slap.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(SlapEmbed);
		}
	}
}

module.exports = SlapCommand;
