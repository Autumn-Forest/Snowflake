interface Array<T> {
	/**
	 * Get n random elements from an array
	 * @param n Number of random elements to retrieve
	 */
	random(): T;
	random(n: number): T[];
}

Array.prototype.random = function (n = 1) {
	const res = this.sort(() => 0.5 - Math.random()).slice(0, n);
	return res.length === 1 ? res[0] : res;
};
