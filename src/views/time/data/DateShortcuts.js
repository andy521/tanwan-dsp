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

