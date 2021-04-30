const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');

class WarnsCommand extends Command {
	constructor() {
		super('warns', {
			aliases: ['warns'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor('776fc5')
								.setDescription("Who's warns you want to see?")
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
			],
			description: {
				description: 'Shows list of warnings of a member.',
				usage: 'warns <member>',
			},
		});
	}

	async exec(message, args) {
		const warns = await this.client.db.hdWarns.find({
			warnedMember: args.member.user.id,
		});
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
						.setDescription("You can't do that with the permissions you have."),
				);
		}
		if (!warns.length)
			return message.channel.send(
				new Discord.MessageEmbed({
					color: 15850433,
					description: `**${args.member}** has no warnings.`,
				}),
			);
		const warnsEmbed = new Discord.MessageEmbed()
			.setTitle(`${args.member.user.username}'s warns:`)
			.setDescription(
				warns
					.map(
						(x) =>
							`**WarnID:** ${x._id}\n**By:** <@!${
								x.warnedStaff
							}>\n**Reason:** ${x.reason}\n**Warned At**: ${moment(
								x.when,
							).format('LLLL')}`,
					)
					.join('\n\n'),
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		message.channel.send(warnsEmbed);
	}
}

module.exports = WarnsCommand;
