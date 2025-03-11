
import { format } from "date-fns";

type DateFormat = 'mdy' | 'dmy' | 'ymd';
type TimeFormat = '12h' | '24h';

/**
 * Format a date based on the user's preferred format
 */
export const formatDate = (date: Date, dateFormat: DateFormat): string => {
  switch (dateFormat) {
    case 'mdy':
      return format(date, 'MM/dd/yyyy');
    case 'dmy':
      return format(date, 'dd/MM/yyyy');
    case 'ymd':
      return format(date, 'yyyy/MM/dd');
    default:
      return format(date, 'MM/dd/yyyy');
  }
};

/**
 * Format a time based on the user's preferred format
 */
export const formatTime = (date: Date, timeFormat: TimeFormat): string => {
  switch (timeFormat) {
    case '12h':
      return format(date, 'h:mm a');
    case '24h':
      return format(date, 'HH:mm');
    default:
      return format(date, 'h:mm a');
  }
};

/**
 * Format a datetime based on the user's preferred formats
 */
export const formatDateTime = (
  date: Date, 
  dateFormat: DateFormat, 
  timeFormat: TimeFormat
): string => {
  return `${formatDate(date, dateFormat)} ${formatTime(date, timeFormat)}`;
};
