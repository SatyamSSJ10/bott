const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class ReplyCommand extends Command {
	constructor() {
		super('reply', {
			aliases: ['reply'],
			category: 'Utility',
			ownerOnly: false,
			channel: 'guild',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('Who do you want to reply?')
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(member);
						},
						cancelWord: 'cancel',
						cancel: (message) => {
							const cancelEmbed = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('Command has been canceled.');
							message.channel.send(cancelEmbed);
						},
					},
				},
				{
					id: 'message',
					type: 'string',
					prompt: {
						start: (message) => {
							const replyEmbed = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('What do you want to say to them?')
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(replyEmbed);
						},
						cancelWord: 'cancel',
						cancel: (message) => {
							const cancelEmbed = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('Command has been canceled.');
							message.channel.send(cancelEmbed);
						},
					},
				},
			],
		});
	}

	async exec(message, args) {
		try {
			const permRoles = [
				'796208075463196689', // Admin
				'796208075463196687', // Discord Moderator
				'796208075463196685', // Moderator
				'796208075451007044', // Trial Moderator
				'811337136397221909', // Bot Dev
			];
			var i;
			for (i = 0; i <= permRoles.length; i++) {
				if (
					message.member.roles.cache
						.map((x) => x.id)
						.filter((x) => permRoles.includes(x)).length === 0
				)
					return message.channel.send(
						new Discord.MessageEmbed()
							.setColor(15850433)
							.setDescription(
								"You can't do that with the permissions you have.",
							),
					);
			}
			const messageSentEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setDescription(`Your reply is sent to ${args.member}`);
			const replyEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setDescription(`**${message.author.tag} says**: ${args.message}`);
			await args.member
				.send(replyEmbed)
				.then(() => message.channel.send(messageSentEmbed))
				.catch((err) => {
					message.channel.send(
						new Discord.MessageEmbed({
							color: 15850433,
							description: `Their DM's set to closed, therefore I couldn't DM them about their ban.\n**Error**: ${err.message}`,
						}),
					);
				});
		} catch (err) {
			const userDMsClosedEmbed = new Discord.MessageEmbed()
				.setColor(15850433)
				.setDescription(`**${args.member.user.username}**'s DMs are closed.`);
			return message.channel.send(userDMsClosedEmbed);
		}
	}
}

module.exports = ReplyCommand;
