export function deepFind(value: any, list: any[]) {
	function deep(arr: any[]): any | undefined {
		for (const e of arr) {
			if (e.value === value) {
				return e;
			} else if (e.children) {
				const d = deep(e.children);
				if (d !== undefined) {
					return d;
				}
			}
		}
		return undefined;
	}

	return deep(list);
}
/**
 * @description: 将毫秒转换为时分秒
 * @param {number} duration
 * @return {*}
 * @author: 池樱千幻
 */
export function msToTime(duration: number) {
	const seconds = Math.floor((duration / 1000) % 60);
	const minutes = Math.floor((duration / (1000 * 60)) % 60);
	const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	let result = "";

	if (hours > 0) {
		result += hours + "小时";
	}
	if (minutes > 0) {
		result += minutes + "分钟";
	}
	if (seconds > 0) {
		result += seconds + "秒";
	}

	return result;
}
