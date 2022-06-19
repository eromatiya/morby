require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({intents: [
	Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS]
});

const morsData = {
	genChatID: "848475975469236227",
	rolesID: "848510393298452480",
	introID: "849678362158956604"
};

// Logged in
client.on('ready', () =>{
    console.log(`${client.user.username}` + " has logged in!");

	// Set Activity
	let state = 0;
	const presences = [
		{ type: 'PLAYING', message: 'ToramOnline' },
		{ type: 'WATCHING', message: 'Toram | How to become rich fast using mods' },
		{ type: 'STREAMING', message: 'Half-Life 3'}
	];

	setInterval(() => {
		state = (state + 1) % presences.length;
		const presence = presences[state];

		client.user.setActivity(presence.message, { type: presence.type });
	}, 3600000 );
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	
	const channel = client.channels.cache.get(morsData.genChatID);
	
	if(oldMember.roles.cache.size < newMember.roles.cache.size) {
		const fetchedLogs = await oldMember.guild.fetchAuditLogs({
			limit: 1,
			type: 'MEMBER_ROLE_UPDATE',
		});
		
		const roleAddLog = fetchedLogs.entries.first();
		if (!roleAddLog ) return;
		const { executor, target, changes } = roleAddLog;
		
		console.log(`Role ${changes[0].new[0].name} added to <@${target.id}> by <@${executor.id}>`)

		function isNewComer() {
			return oldMember.roles.cache.some(role => role.name === 'Newcomer')
		}
		
		function isMorsCerta() {
			return changes[0].new[0].name === 'Mors Certa'
		}
		
		if (isNewComer() && isMorsCerta()) {
			const newComer = newMember.user.id
			const newTitle = `***Welcome to Mors Certa!***`
			let newMsg = `*Hey hey, <@${newComer}>!*`
				+ ` *Don't be shy, come say hi! Tell us a little bit about yourself in <#${morsData.introID}>!*`
				+ ` *Don't forget to grab your <#${morsData.rolesID}> too, btw! *`
				+ ` *Enjoy your stay here! ( ꈍᴗꈍ)*`
			const morbyImg = "https://raw.githubusercontent.com/manilarome/morby/main/img/morby.png"
			
			// Send welcome msg to gen channel channel
			channel.send({ embeds: [{
				title: newTitle,
				description: newMsg,
				color: "A020F0",
				image: {
					url: morbyImg
				}
			}]});
		}
	}
});

const PREFIX = "/"
client.on('messageCreate', async message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	if (message.content.startsWith(PREFIX)) {
		
		const [CMD, ...args] = message.content
			.toLowerCase()
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/);

		if (CMD === 'morby') {
			message.reply(`Who is that? Must've been the wind!`)
		}
	}
})

client.login(process.env.TOKEN);
