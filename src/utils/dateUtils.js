// src/utils/dateUtils.js
import { addMonths, addYears, addQuarters, addDays, parseISO } from 'date-fns';

export const calculateNextPaymentDate = (startDateString, billingFrequency, customFrequencyDays) => {
  const startDate = parseISO(startDateString); // Ensure startDate is a Date object

  switch (billingFrequency) {
    case 'Monthly':
      return addMonths(startDate, 1).toISOString().split('T')[0];
    case 'Yearly':
      return addYears(startDate, 1).toISOString().split('T')[0];
    case 'Quarterly':
      // Assuming Quarterly means every 3 months from the start date
      return addQuarters(startDate, 1).toISOString().split('T')[0]; 
    case 'Custom':
      if (customFrequencyDays && customFrequencyDays > 0) {
        return addDays(startDate, customFrequencyDays).toISOString().split('T')[0];
      }
      // Fallback if custom days not provided or invalid - perhaps return startDate or error
      // console.warn('Custom frequency selected but no valid customFrequencyDays provided.'); // Commented out
      return startDateString; // Or handle error appropriately
    default:
      // console.warn(`Unknown billing frequency: ${billingFrequency}`); // Commented out
      return startDateString; // Or handle error appropriately
  }
};
