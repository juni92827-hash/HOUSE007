export const ORDER_STATUS_FLOW = ['Preparing', 'Shipped', 'In Transit', 'Delivered'];

const ORDER_STATUS_LABELS_KR = {
  Preparing: '준비 중',
  Shipped: '배송 시작',
  'In Transit': '배송 중',
  Delivered: '배송 완료',
};

/**
 * getOrderStatusLabel — Korean display label for a value from ORDER_STATUS_FLOW.
 * The English values stay unchanged so status comparisons keep working.
 *
 * @param {string} status - one of ORDER_STATUS_FLOW [Required]
 */
export function getOrderStatusLabel(status) {
  return ORDER_STATUS_LABELS_KR[status] ?? status;
}

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
