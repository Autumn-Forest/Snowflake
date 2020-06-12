interface String {
	/**
	 * Shorten a string
	 * @param length The maximum length the string may have
	 */
	shorten(length: number): string;
	/**
	 * Turn a string into a codeblock
	 * @param language The language. Defaults to ts
	 */
	toCodeblock(language?: string): string;

	toTitleCase(): string;

	escapeMarkdown(): string;

	substitute(obj: { [key: string]: string }): string;
}

String.prototype.shorten = function (length: number) {
	return (this.length > length ? this.substring(0, length - 3) + '...' : this).toString();
};

String.prototype.toCodeblock = function (language = 'ts') {
	return '```' + language + '\n' + this + '```';
};

String.prototype.toTitleCase = function () {
	return this.split(/[\s_]+/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};

String.prototype.escapeMarkdown = function () {
	return this.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
};

String.prototype.substitute = function (obj: { [key: string]: string }) {
	let str = this.toString();
	for (const prop in obj) {
		str = str.replace(new RegExp('{' + prop + '}', 'g'), obj[prop]);
	}
	return str;
};
