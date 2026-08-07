const TURKISH_CHARACTERS: Readonly<Record<string, string>> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
};

/** Türkçe karakterleri ve büyük/küçük harf farkını arama için normalize eder. */
export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (character) => TURKISH_CHARACTERS[character] ?? character);
}

/** Sorgudaki her kelimenin aranabilir alanlardan en az birinde bulunmasını ister. */
export function matchesSearchQuery(values: ReadonlyArray<string>, query: string): boolean {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const searchableText = normalizeSearchText(values.join(' '));
  return terms.every((term) => searchableText.includes(term));
}
