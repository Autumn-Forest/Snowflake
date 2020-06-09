const ordinal = require('ordinal');

interface Number {
	toOrdinal(): string;
	addZero(): string;
}

Number.prototype.toOrdinal = function () {
	return ordinal(this);
};

Number.prototype.addZero = function () {
	return this < 10 ? '0' + this : this.toString();
};
