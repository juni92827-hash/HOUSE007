/**
 * getRecommendation
 *
 * Scores every product against the Client File answers by counting how many
 * of the product's tag arrays (mission_tags, presence_tags, style_tags,
 * fit_tags, color_tags) contain the matching answer. Highest score wins;
 * ties break on display_order. Always returns a product.
 *
 * @param {Array} products - rows from the `products` table
 * @param {{mission:string, presence:string, style:string, fit:string, color:string}} answers
 */
export function getRecommendation(products, answers) {
  if (!products || products.length === 0) return null;

  const scored = products.map((product) => {
    let score = 0;
    if (answers.mission && product.mission_tags?.includes(answers.mission)) score += 1;
    if (answers.presence && product.presence_tags?.includes(answers.presence)) score += 1;
    if (answers.style && product.style_tags?.includes(answers.style)) score += 1;
    if (answers.fit && product.fit_tags?.includes(answers.fit)) score += 1;
    if (answers.color && product.color_tags?.includes(answers.color)) score += 1;
    return { product, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.product.display_order - b.product.display_order;
  });

  return scored[0].product;
}

export function getMissionProfileLabel(answers) {
  const labels = {
    business: 'THE EXECUTIVE',
    formal: 'THE COMMANDER',
    daily: 'THE GENTLEMAN',
    special: 'THE ICON',
  };
  return labels[answers.mission] || 'THE CLIENT';
}
