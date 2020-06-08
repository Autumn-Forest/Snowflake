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
