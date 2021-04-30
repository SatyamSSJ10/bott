const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class MemberCountCommand extends Command {
	constructor() {
		super('membercount', {
			aliases: ['membercount', 'mc'],
			channel: 'guild',
			category: 'Server',
			description: {
				description: 'Get the server member count.',
				usage: 'membercount',
			},
		});
	}

	async exec(message) {
		const defaultChannel = this.client.channels.cache.find(
			(c) => c.id === '796208076276367374',
		);
		const hiddenDungeon = this.client.guilds.cache.find(
			(g) => g.id === '796208075434360832',
		);
		let hiddenDungeonExceptBots =
			hiddenDungeon.members.cache.size -
			hiddenDungeon.members.cache.filter((u) => u.user.bot).size;
		const memberCountEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setAuthor('Total Amount of Members', null, null)
			.setDescription(
				`Total Members: ${hiddenDungeon.members.cache.size}\nExcluding Bots: ${hiddenDungeonExceptBots}`,
			);
		const permRoles = [
			'803065968426352640', // Qixing Secretary
			'795102781346021376', // Head Admin
			'786025543124123698', // Server Admin
			'786025543124123699', // Network Admin
			'786025543085981705', // Moderator
		];
		var i;
		for (i = 0; i <= permRoles.length; i++) {
			if (
				message.member.roles.cache
					.map((x) => x.id)
					.filter((x) => permRoles.includes(x)).length === 0
			)
				return message.channel.send(memberCountEmbed);
		}
		if (message.channel.id !== defaultChannel.id) {
			const wrongChannelEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setAuthor('Wrong Usage!')
				.setDescription(
					`You can't use \`${
						this.client.commandHandler.prefix + this.id
					}\` here, it's meant to be used in: ${defaultChannel}`,
				);
			return message.channel.send(wrongChannelEmbed);
		} else return message.channel.send(memberCountEmbed);
	}
}

module.exports = MemberCountCommand;
