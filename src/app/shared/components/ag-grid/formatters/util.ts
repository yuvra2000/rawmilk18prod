
export const STATUS_DEFINITIONS: Record<number, { text: string; cssClass: string }> = {
  0: { text: 'Rejected', cssClass: 'status-delete' },
  1: { text: 'Approved', cssClass: 'status-approved' },
  2: { text: 'De-active', cssClass: 'status-de-active' },
  3: { text: 'Pending', cssClass: 'status-pending' }
};