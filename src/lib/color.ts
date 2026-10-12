/**
 * Cor de assinatura determinística e única por índice (ângulo de ouro no matiz).
 * Os dados usam `sig(k)` para que a cor de cada entidade não colida com a de outra.
 */
export function sig(index: number): string {
  const hue = (index * 137.508) % 360
  return `hsl(${hue.toFixed(1)} 85% 62%)`
}
