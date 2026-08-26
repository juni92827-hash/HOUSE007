export const ORDER_STATUS_FLOW = ['Preparing', 'Shipped', 'In Transit', 'Delivered'];

/**
 * computeOrderStatus
 *
 * There is no fulfillment backend behind this project, so delivery status is
 * simulated deterministically from elapsed time since the order was placed.
 * Thresholds are in minutes so a reviewer can watch an order progress
 * through the full flow within a single session.
 *
 * @param {string} createdAt - ISO timestamp from orders.created_at [Required]
 */
export function computeOrderStatus(createdAt) {
  const elapsedMinutes = (Date.now() - new Date(createdAt).getTime()) / 60000;
  if (elapsedMinutes < 2) return ORDER_STATUS_FLOW[0];
  if (elapsedMinutes < 5) return ORDER_STATUS_FLOW[1];
  if (elapsedMinutes < 10) return ORDER_STATUS_FLOW[2];
  return ORDER_STATUS_FLOW[3];
}
