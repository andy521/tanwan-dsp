export const DateShortcuts = {
	shortcuts: [{
			text: '今天',
			value() {
				const start = new Date();
				return [start, start];
			}
		},
		{
			text: '昨天',
			value() {
				const date = new Date();
				date.setTime(date.getTime() - 3600 * 1000 * 24);
				return [date, date];;
			}
		}, {
			text: '过去7天',
			value() {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				return [start, end];
			}
		},
		{
			text: '过去30天',
			value() {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

				return [start, end];
			}
		},
		{
			text: '本月',
			value() {
				const end = new Date();
				const start = new Date();
				start.setTime(start.setDate(1));
				return [start, end];
			}
		},
		{
			text: '上月',
			value() {
				const end = new Date();
				end.setTime(end.setDate(0));
				const start = new Date();
				start.setTime(start.setDate(0));
				start.setTime(start.setDate(1));
				return [start, end];
			}
		}
	]
}

//时间转换
export function formatDate(date, fmt) {
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for(let k in o) {
		if(new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

function padLeftZero(str) {
	return('00' + str).substr(str.length);
}

//一周投放时间转码
export function changetime(time) {
	if(!time) return;
	var weektime = [];
	for(let j = 0; j < 7; j++) {
		let week = time.substring(j * 48, (j + 1) * 48),
			newtime = [],
			oldtime = [],
			check = true,
			stime = 0;
		for(let i = 0; i < week.length; i++) {
			if(week[i] == 1) {
				if(check) {
					oldtime.push(toHourMinute(stime))
				} else if((i + 1) == week.length) {
					oldtime.push(toHourMinute(1440))
				}
				check = false;
			} else {
				if(!check) {
					oldtime.push(toHourMinute(stime))
				}
				check = true;
			}
			stime = stime + 30;
		}
		oldtime.forEach((item, i) => {
			if(i % 2 !== 0) {
				newtime.push(oldtime[i - 1] + '-' + item)
			}
		});
		weektime.push(newtime);
	}

	let same = true;
	for(let i = 0; i < weektime.length; i++) {
		if(weektime[0].toString() != weektime[i].toString()) {
			same = false;
		}
	}

	let week = '';
	if(same) {
		if(weektime[0].toString() == "00:00-24:00") {
			week = '全部时间点'
		} else {
			week = weektime[0].toString();
		}
	} else {
		for(let i = 0; i < 7; i++) {
			if(i == 0) {
				week = weektime[i].toString()
			} else {
				week = week + '<br/>' + weektime[i].toString()
			}
		}
	}
	return week;
}

//分钟转换时间
export function toHourMinute(minutes) {
	let h = Math.floor(minutes / 60);
	let m = minutes % 60
	if(h < 10) h = "0" + h;
	if(m < 10) m = "0" + m;
	return(h + ":" + m);
}

//深层复制
export function deepClone(obj) {
	if(obj === null || typeof obj !== 'object') {
		return obj;
	}
	if(obj instanceof Array) {
		var copy = [];
		for(var i = 0; i < obj.length; i++) {
			copy.push(obj[i]);
		}
		return copy;
	}
	if(obj instanceof Date) {
		var copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	if(obj instanceof Object) {
		var copy = {};
		for(var key in obj) { //递归 
			if(obj.hasOwnProperty(key)) {
				copy[key] = deepClone(obj[key]);
			}
		}
		return copy;
	}
}