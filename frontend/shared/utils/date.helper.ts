import {
  format,
  isToday,
  formatDistanceStrict,
  isThisYear,
  isThisHour,
  parseISO
} from 'date-fns';

import { tz } from '@date-fns/tz';

export type DateTerminal = {
  month: number;
  year: number;
};

export function formatDateInTimezone(
  dateString: Date | string,
  availableTimezone?: string,
  dateFormat = 'MMM dd, yyyy hh:mm a'
) {
  if (!dateString) return dateString;

  const timezone = availableTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const utcDate = dateString instanceof Date ? dateString : new Date(dateString);

  return format(utcDate, dateFormat, {
    in: tz(timezone),
  });
}

export const getUserTimezone = (user?: { timezone?: string }) => {
  if (user?.timezone) {
    return user.timezone;
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const dateFormat = (
  date: Date | '',
  showDateForBeforeToday?: boolean,
  availableTimezone?: string
) => {
  const stringFormats = {
    day_month_dayNumber: '',
    normalTime: '',
    unformattedTime: '',
    dateWithHyphen: '',
    monthAndYear: '',
    dateWithHyphenYearFirst: '',
    dateWithSlashYearFirst: '',
    dateWithWordMonthAndTime: '',
    dateWithWordMonth: '',
  };

  if (!date) {
    return stringFormats;
  }
  const dateString = new Date(date || 0)?.toISOString();

  const timezone = availableTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const zonedDate = parseISO(dateString, {
    in: tz(timezone),
  });

  const _date = zonedDate;
  const _isToday = isToday(_date);
  const _isThisYear = isThisYear(_date);
  const _isThisHour = isThisHour(_date);

  const fromNow = formatDistanceStrict(_date, new Date());

  const formattedDate = _isToday
    ? 'Today'
    : format(_date, `eee, MMM.dd ${_isThisYear ? '' : 'yyyy'}`);

  const monthAndYear = _isToday ? 'Today' : format(_date, `MMMM${_isThisYear ? '' : ', yyyy'}`);

  const dateWithHyphen = format(_date, 'dd - MM - yyyy');

  const dateWithHyphenYearFirst = format(_date, 'yyyy-MM-dd');

  const dateWithSlashYearFirst = format(_date, 'yyyy/MM/dd');

  const dateWithWordMonthAndTime = format(_date, 'MMM dd, yyyy hh:mm a');

  const dateWithWordMonth = format(_date, 'MMM dd, yyyy ');

  const formattedTime = _isThisHour
    ? fromNow
    : _isToday || !showDateForBeforeToday
      ? format(_date, 'p')
      : dateWithHyphen;

  return {
    ...stringFormats,
    day_month_dayNumber: formattedDate,
    normalTime: formattedTime
      .replace('seconds', 'secs')
      .replace('minutes', 'mins')
      .replace('second', 'sec')
      .replace('minute', 'min'),
    unformattedTime: format(_date, 'p'),
    dateWithHyphen,
    monthAndYear,
    dateWithHyphenYearFirst,
    dateWithSlashYearFirst,
    dateWithWordMonthAndTime,
    dateWithWordMonth,
  };
};

export function getMonthName(monthNumber: number) {
  const date = new Date();

  date.setMonth((monthNumber || 0) - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}

export const formatDateRange = ({
  start_date,
  end_date,
  current = false,
}: {
  start_date: DateTerminal;
  end_date: DateTerminal;
  current?: boolean;
}) => {
  const startDate = `${start_date?.month ? getMonthName(start_date.month) + ',' : ''} ${
    start_date?.year || ''
  }`;

  const endDate = !current
    ? end_date
      ? `${end_date?.month ? getMonthName(end_date?.month) + ',' : ''} ${end_date?.year || ''}`
      : null
    : null;

  return `${startDate + ' - ' || ''} ${endDate || 'Present'}`;
};

export const monthYearDateRange = ({ startDate = '', endDate = '' }) => {
  return `${dateFormat(startDate as any).monthAndYear || ''} - ${
    endDate ? dateFormat(endDate as any).monthAndYear : 'Present'
  }`;
};

/**One second in milliseconds */
const SECONDS = 1000;
/**One minute in milliseconds */
const MINUTES = 60 * SECONDS;
/**One hour in milliseconds */
const HOURS = 60 * MINUTES;
/**One day in milliseconds */
const DAYS = 24 * HOURS;
/**One week in milliseconds */
const WEEKS = 7 * DAYS;

export { SECONDS, MINUTES, HOURS, DAYS, WEEKS };
