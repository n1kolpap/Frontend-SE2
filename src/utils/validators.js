export const validateLogin = ({ username, password }) => {
	const errors = {};
	if (!username || username.trim().length < 3) {
		errors.username = 'Username must be at least 3 characters.';
	}
	if (!password || password.length < 6) {
		errors.password = 'Password must be at least 6 characters.';
	}
	return errors;
};

export const validateSignup = ({ username, password, email }) => {
	const errors = validateLogin({ username, password });
	if (email && !email.includes('@')) {
		errors.email = 'Email is not valid.';
	}
	return errors;
};

export const validateTrip = (form) => {
	const errors = {};
	if (!form.destination || !form.destination.trim()) {
		errors.destination = 'Destination is required.';
	}
	if (!form.startDate) {
		errors.startDate = 'Start date is required.';
	}
	if (!form.endDate) {
		errors.endDate = 'End date is required.';
	}
	if (form.startDate && form.endDate && form.startDate > form.endDate) {
		errors.endDate = 'End date must be after start date.';
	}
	if (form.budget && Number(form.budget) < 0) {
		errors.budget = 'Budget cannot be negative.';
	}
	return errors;
};

export const validateTripUpdate = (form) => {
	// Similar to validateTrip, but all fields optional except that if both dates present, order must be ok.
	const errors = {};
	if (form.startDate && form.endDate && form.startDate > form.endDate) {
		errors.endDate = 'End date must be after start date.';
	}
	if (form.budget && Number(form.budget) < 0) {
		errors.budget = 'Budget cannot be negative.';
	}
	return errors;
};
