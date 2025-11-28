const toDate = (value) => {
	if (!value) return null;
	return new Date(value);
};

export const formatDateRange = (start, end) => {
	const s = toDate(start);
	const e = toDate(end);
	if (!s && !e) return '';
	const opts = { day: 'numeric', month: 'short', year: 'numeric' };
	if (s && e) {
		return `${s.toLocaleDateString(undefined, opts)} – ${e.toLocaleDateString(
			undefined,
			opts
		)}`;
	}
	if (s) return s.toLocaleDateString(undefined, opts);
	return e.toLocaleDateString(undefined, opts);
};

export const formatDayLabel = (dateStr) => {
	const d = toDate(dateStr);
	if (!d) return '';
	return d.toLocaleDateString(undefined, {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
};
