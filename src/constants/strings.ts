import '../interfaces/Array';

export const actionStrings: Record<string, Array<string>> = {
	tickle: [
		'hihi, {{USER}} tickles you, {{MEMBER}}!',
		'hey {{MEMBER}} be aware! {{USER}} is trying to tickle you :P',
		'How cute! {{USER}} tickles {{MEMBER}} <:hehehe:707301622031843349>'
	],

	kiss: [
		'OwO, {{USER}} is kissing {{MEMBER}}!',
		'How cute! {{MEMBER}} and {{USER}} are kissing :3',
		'{{USER}} softly kisses {{MEMBER}} lips!',
		'Hey {{MEMBER}}, i think someone likes you <:hehehe:707301622031843349>. {{USER}} is kissing you ^°^',
		'I smell love! {{USER}} kisses {{MEMBER}} passionately!'
	],
	cuddle: [
		'{{USER}} cuddles {{MEMBER}}',
		'{{USER}} is cuddling {{MEMBER}} tightly',
		'Hey {{MEMBER}}! {{USER}} wants to cuddle you :3',
		'Awwww, {{USER}} snuggles {{MEMBER}}',
		'{{MEMBER}} is held so tightly in {{USER}} arms :D'
	],
	slap: [
		'Oop- {{MEMBER}} was mean to {{USER}}',
		'{{MEMBER}} is a baka! {{USER}} slaps them!',
		'Oh! Y-you really want to slap {{MEMBER}}, {{USER}}?',
		'{{MEMBER}}, {{USER}} is slapping you!',
		'Oops {{MEMBER}}, you made {{USER}} mad.'
	],
	hug: [
		'{{USER}} holds {{MEMBER}}',
		'{{USER}} hugs {{MEMBER}}',
		'Are you alright {{MEMBER}}? Well {{USER}} is here for you, with a huge hug!',
		'{{USER}} jumps on {{MEMBER}} to hug them!',
		"Eeep- {{MEMBER}}! You're getting hugged by {{USER}}!"
	],
	pat: ['{{USER}} pats {{MEMBER}}', '{{USER}} notices your effort {{MEMBER}} and headpats you :3']
};
