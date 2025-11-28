export const formatDate = (date) => new Date(date).toLocaleDateString();

export const calculateBudget = (activities) => {
    return activities.reduce((total, activity) => total + (activity.cost || 0), 0);
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const isEmpty = (value) => {
    return value === null || value === undefined || value.trim() === '';
};