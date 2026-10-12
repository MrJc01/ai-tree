/** Verdadeiro quando o foco está num campo de texto. Atalhos de tecla não devem disparar nesse caso. */
export function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}
