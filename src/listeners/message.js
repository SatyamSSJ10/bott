const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
class MessageListener extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(message) {
		if (
			await this.client.db.hdBlacklists.findOne({
				channel_id: message.channel.id,
			})
		)
			return;
		const hdServer = this.client.guilds.cache.get('796208075434360832');
		const dmLogsChannel = hdServer.channels.cache.get('811340494025130034');
		const dmLogsEmbed = new Discord.MessageEmbed()
			.setAuthor(
				`DM From ${message.author.tag}`,
				message.author.displayAvatarURL(),
			)
			.setColor(29128)
			//.setTitle(`**I got a DM from ${message.author.tag}!**`)
			.setDescription(`**They said**: ${message.content}`)
			.setFooter(
				`Use ${this.client.commandHandler.prefix}reply <userID> <message> to respond.\nTheir ID: ${message.author.id}`,
				this.client.user.displayAvatarURL(),
			);
		if (message.author.bot) return;
		if (message.guild == null) return dmLogsChannel.send(dmLogsEmbed);
		if (
			!message.content.startsWith(this.client.commandHandler.prefix) ||
			message.author.bot
		)
			return;

		const args = message.content
			.slice(this.client.commandHandler.prefix.length)
			.trim()
			.split(/ +/);
		const quotes = await this.client.db.hdQuotes.findOne({
			quoteName: args[0],
		});
		if (quotes)
			return message.channel.send(
				quotes.embed
					? new Discord.MessageEmbed(JSON.parse(quotes.quote))
					: quotes.quote,
			);
	}
}

module.exports = MessageListener;
