const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class PokeCommand extends Command {
	constructor() {
		super('poke', {
			aliases: ['poke'],
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
				description: 'Poke a user.',
				usage: 'poke <user>',
			},
		});
	}

	async exec(message, args) {
		const Poke = await neko.sfw.poke();
		if (args.member.id !== message.author.id) {
			const userToPokeEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} pokes ${args.member.user.username}!`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Poke.url,
				)
				.setImage(Poke.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(userToPokeEmbed);
		} else {
			const PokeEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor(
					`${message.author.username} pokes themselves, I think it's fun...?`,
					`${message.author.avatarURL({ dynamic: true, size: 2048 })}`,
					Poke.url,
				)
				.setImage(Poke.url)
				.setFooter(`Cooldown ${(this.cooldown / 1000) * 1} seconds.`);
			message.channel.send(PokeEmbed);
		}
	}
}

module.exports = PokeCommand;
