export const isValidDate = (dateString: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
};

export const isValidTime = (timeString: string): boolean => {
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(timeString)) return false;

    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
};