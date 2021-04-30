const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class CuddleCommand extends Command {
	constructor() {
		super('cuddle', {
			aliases: ['cuddle'],
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
				description: 'Cuddle a user.',
				usage: 'cuddle <user>',
			},
		});
	}

	async exec(message, args) {
		const cuddle = await neko.sfw.cuddle();
		if (args.member.id !== message.author.id) {
			const cuddleTo = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} cuddles ${args.member.user.username}!`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					cuddle.url,
				)
				.setImage(cuddle.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(cuddleTo);
		} else {
			const cuddleEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} cuddles themselves, they must be lonely :c`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					cuddle.url,
				)
				.setImage(cuddle.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(cuddleEmbed);
		}
	}
}

module.exports = CuddleCommand;
