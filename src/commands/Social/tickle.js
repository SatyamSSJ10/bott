const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class TickleCommand extends Command {
	constructor() {
		super('tickle', {
			aliases: ['tickle'],
			args: [
				{
					id: 'member',
					type: 'memberMention',
				},
			],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Tickle a user.',
				usage: 'tickle <user>',
			},
		});
	}

	async exec(message, args) {
		const Tickle = await neko.sfw.tickle();
		if (args.member) {
			const userToTickleEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} Tickles ${args.member.user.username}!`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Tickle.url,
				)
				.setImage(Tickle.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(userToTickleEmbed);
		} else {
			const TickleEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} Tickles themselves, don't ask me how-`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Tickle.url,
				)
				.setImage(Tickle.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(TickleEmbed);
		}
	}
}

module.exports = TickleCommand;
