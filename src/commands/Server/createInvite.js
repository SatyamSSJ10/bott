const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class CreateInviteCommand extends Command {
	constructor() {
		super('createinvite', {
			aliases: ['createinvite', 'invite', 'inv'],
			ownerOnly: false,
			category: 'Server',
			channel: 'guild',
			cooldown: 10000,
			description: {
				description: 'Creates invite for the server and sends it.',
				usage: 'createinvite or inv',
			},
		});
	}

	exec(message) {
		const checkPermsEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription("Apparently you can't create invite.");
		if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
			return message.channel.send(checkPermsEmbed);
		message.channel.send(`https://discord.gg/ganyumains`);
	}
}

module.exports = CreateInviteCommand;
