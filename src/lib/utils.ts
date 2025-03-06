import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/lib/utils/date.ts
import { format, formatDistanceToNow, isToday, isPast } from 'date-fns';

/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }

  // If date is within the next 7 days or previous 7 days
  const distanceToNow = formatDistanceToNow(date, { addSuffix: true });
  if (
    (distanceToNow.includes('days') &&
      distanceToNow.includes('in') &&
      parseInt(distanceToNow) <= 7) ||
    (distanceToNow.includes('ago') && parseInt(distanceToNow) <= 7)
  ) {
    return distanceToNow;
  }

  return format(date, 'MMM d, yyyy');
};

/**
 * Determines if a due date is approaching soon (within 48 hours)
 * @param dateString - ISO date string
 * @returns Boolean indicating if due date is approaching
 */
export const isDueSoon = (dateString: string): boolean => {
  const now = new Date();
  const dueDate = new Date(dateString);

  // Calculate difference in hours
  const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Return true if due date is within the next 48 hours and not past
  return diffInHours > 0 && diffInHours <= 48;
};

/**
 * Creates a human-readable time remaining string
 * @param dateString - ISO date string
 * @returns Time remaining string
 */
export const getTimeRemaining = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);

  if (isPast(date)) {
    return 'Past due';
  }

  return formatDistanceToNow(date, { addSuffix: true });
};

// Convert snake_case to camelCase
export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace('-', '').replace('_', '')
        )]: toCamelCase(obj[key]),
      }),
      {}
    );
  }
  return obj;
};
