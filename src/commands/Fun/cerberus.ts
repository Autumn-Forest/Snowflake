import { Command, Message } from '../../Client';

const images = [
	'https://cdn.discordapp.com/attachments/719333414586548285/719333805931888670/cerberus20.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333789989339196/cerberus7.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333788311748678/cerberus19.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333754560184320/cerberus2.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333732858724352/cerberus10.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333725753573376/cerberus18.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333703226228797/cerberus8.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333699237445733/cerberus.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333699912728676/cerberus17.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333696905150546/cerberus6.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333685605695488/cerberus16.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333680379723786/cerberus9.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333672309751888/cerberus15.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333666588852305/cerberus14.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333663699107901/cerberus13.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333656086315149/cerberus12.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333641380954213/cerberus11.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333644501778472/cerberus5.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333627548401724/cerberus5.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333624918310933/cerberus10.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333625014910997/cerberus2.gif',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333613753335818/cerberus9.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333603523297290/cerberus8.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333596326002749/cerberus4.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333585622138983/cerberus7.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333566848172082/cerberus6.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333531909881897/cerberus3.png',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333527182639104/cerberus4.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333522510315600/cerberus.gif',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333520815816784/cerberus3.gif',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333502453284905/cerberus3.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333486250688612/cerberus2.jpg',
	'https://cdn.discordapp.com/attachments/719333414586548285/719333485524811856/cerberus1.png'
];

const callback = async (msg: Message, _args: string[]) => {
	const embed = msg.client
		.newEmbed('BASIC')
		.setImage(images.random())
		.setAuthor('Cerberus', msg.author.displayAvatarURL({ dynamic: true }));

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['cerb'],
	description: 'Get a [Cerberus](https://helltakergame.fandom.com/wiki/Cerberus) image!',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
