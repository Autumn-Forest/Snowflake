interface Date {
	formatDate(): string;
	formatTime(): string;
	age(): string;
}

Date.prototype.formatDate = function () {
	return `${
		['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]
	} ${this.getDate().toOrdinal()} ${this.getFullYear()}`;
};

Date.prototype.formatTime = function () {
	return `${this.getUTCHours().addZero()}:${this.getUTCMinutes().addZero()}:${this.getUTCSeconds().addZero()} UTC`;
};

Date.prototype.age = function () {
	const age = Date.now() - this.getTime();
	return msToHuman(age);
};

const msToHuman = (ms: number) => {
	const seconds = Math.round(ms / 1000),
		minutes = Math.round(ms / (1000 * 60)),
		hours = Math.round(ms / (1000 * 60 * 60)),
		days = Math.round(ms / (1000 * 60 * 60 * 24));

	if (seconds < 60) return seconds + ' Seconds';
	else if (minutes < 60) return minutes + ' Minutes';
	else if (hours < 24) return hours + ' Hours';
	else return days + ' Days';
};
