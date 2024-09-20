import { format } from 'date-fns';
import moment from 'moment-timezone';
export default function formatDateAndTime(dateString) {
    // Check if the date string contains 'T' as a separator (e.g., 2023-09-17T04:40:55.260Z)
    const isISOString = dateString?.includes('T');

    // Parse the date string using the appropriate format
    const date = isISOString ? new Date(dateString) : new Date(dateString?.replace(' ', 'T'));

    // Create options for Indian date and time format
    const indianDateOptions = {
        timeZone: 'Asia/Kolkata', // Indian time zone
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    const indianTimeOptions = {
        timeZone: 'Asia/Kolkata', // Indian time zone
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Use 12-hour format (true) or 24-hour format (false)
    };

    // Format the date and time in Indian date and time
    const formattedIndianDate = date.toLocaleDateString('en-IN', indianDateOptions);
    const formattedIndianTime = date.toLocaleTimeString('en-IN', indianTimeOptions);
    // Format the date and time
    const formattedDate = formattedIndianDate
    const formattedTime = formattedIndianTime

    return { formattedDate, formattedTime };
}

export function getDayOfWeek(dateString, timeZone = "Asia/Kolkata") {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Parse the input date string using moment-timezone
    const momentDate = moment.utc(dateString);

    // Set the time zone
    momentDate.tz(timeZone);

    const dayOfWeekIndex = momentDate.day(); // 0 for Sunday, 1 for Monday, and so on
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];

    return dayOfWeek;
}


export function capitalizeFirstLetter(word) {
    // Check if the input is a valid string
    if (typeof word !== 'string' || word.length === 0) {
        return word;
    }

    // Capitalize the first letter and concatenate the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1);
}


export function formatChatDate(createdAt) {
    const date = new Date(createdAt);
    const formattedDate = format(date, "dd MMM hh:mm a");
    return formattedDate;
};

export function hideDigits(number) {
    const lastFourDigits = number?.slice(-4); // Get the last four digits
    const hiddenDigits = 'X'.repeat(number?.length - 4); // Replace the rest of the digits with 'X'
    return hiddenDigits + lastFourDigits;
}