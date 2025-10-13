const DEFAULT_SEPARATOR = '-'

export function slugify(
  input: string,
  { separator = DEFAULT_SEPARATOR }: { separator?: string } = {}
) {
  if (!input) {
    return ''
  }

  const normalized = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`${separator}{2,}`, 'g'), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '')

  return normalized || separator
}
