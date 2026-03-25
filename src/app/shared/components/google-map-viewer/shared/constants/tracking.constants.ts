
 // ✅ Centralized List: Statuses where trip is considered STOPPED/ENDED
export const INACTIVE_STATUSES = [
 'Completed', 'NonGPS', 'NoData', 'Breakdown' 
];

/**
 * Helper function to check status easily anywhere in the app
 * Returns TRUE if vehicle is stopped/completed
 */
/**
 * Helper function to check status easily anywhere in the app
 * Returns TRUE if vehicle is stopped/completed
 */
// ✅ THIS MUST BE EXPORTED AS A FUNCTION
export function isVehicleInactive(status: string | undefined | null): boolean {
  console.log('🔍 Check Status (Function):', status);

  // 1. Agar status null, undefined ya empty string ("") hai, toh true return karein
  if (status === null || status === undefined || status.trim() === '') {
    return true; 
  }
  
  // 2. Baaki statuses ko check karein
  const normalizedStatus = status.trim(); // Extra spaces hata dein safe rehne ke liye
  return INACTIVE_STATUSES.includes(normalizedStatus);
}