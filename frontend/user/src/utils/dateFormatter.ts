import { format, parseISO } from "date-fns";

export type DateFormatType =
  | "default" // March 3, 2025 3:15 PM
  | "weekday" // Monday, March 3, 2025 3:15 PM
  | "24hour" // March 3, 2025 15:15
  | "iso" // 2025-03-03 15:15:00
  | "utc"; // March 3, 2025 3:15 PM UTC

export const formatDate = (date: string | Date, formatType: DateFormatType = "default"): string => {
  // Convert string to Date object if needed
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  // Define format patterns
  const formatPatterns: Record<DateFormatType, string> = {
    default: "MMMM d, yyyy h:mm a", // March 3, 2025 3:15 PM
    weekday: "EEEE, MMMM d, yyyy h:mm a", // Monday, March 3, 2025 3:15 PM
    "24hour": "MMMM d, yyyy HH:mm", // March 3, 2025 15:15
    iso: "yyyy-MM-dd HH:mm:ss", // 2025-03-03 15:15:00
    utc: "MMMM d, yyyy h:mm a 'UTC'", // March 3, 2025 3:15 PM UTC
  };

  return format(dateObj, formatPatterns[formatType]);
};
