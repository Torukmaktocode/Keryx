type Names = { es: string; en: string; pt: string }

const LANGUAGES: Record<string, Names> = {
  es: { es: 'español', en: 'Spanish', pt: 'espanhol' },
  en: { es: 'inglés', en: 'English', pt: 'inglês' },
  pt: { es: 'portugués', en: 'Portuguese', pt: 'português' },
  grc: { es: 'griego', en: 'Greek', pt: 'grego' },
  el: { es: 'griego', en: 'Greek', pt: 'grego' },
  he: { es: 'hebreo', en: 'Hebrew', pt: 'hebraico' },
  hbo: { es: 'hebreo', en: 'Hebrew', pt: 'hebraico' },
  la: { es: 'latín', en: 'Latin', pt: 'latim' },
  de: { es: 'alemán', en: 'German', pt: 'alemão' },
  fr: { es: 'francés', en: 'French', pt: 'francês' },
  it: { es: 'italiano', en: 'Italian', pt: 'italiano' },
  nl: { es: 'neerlandés', en: 'Dutch', pt: 'holandês' },
  ru: { es: 'ruso', en: 'Russian', pt: 'russo' },
  uk: { es: 'ucraniano', en: 'Ukrainian', pt: 'ucraniano' },
  pl: { es: 'polaco', en: 'Polish', pt: 'polonês' },
  ro: { es: 'rumano', en: 'Romanian', pt: 'romeno' },
  sv: { es: 'sueco', en: 'Swedish', pt: 'sueco' },
  no: { es: 'noruego', en: 'Norwegian', pt: 'norueguês' },
  da: { es: 'danés', en: 'Danish', pt: 'dinamarquês' },
  hu: { es: 'húngaro', en: 'Hungarian', pt: 'húngaro' },
  cs: { es: 'checo', en: 'Czech', pt: 'tcheco' },
  ar: { es: 'árabe', en: 'Arabic', pt: 'árabe' },
  zh: { es: 'chino', en: 'Chinese', pt: 'chinês' },
  ja: { es: 'japonés', en: 'Japanese', pt: 'japonês' },
  ko: { es: 'coreano', en: 'Korean', pt: 'coreano' },
  vi: { es: 'vietnamita', en: 'Vietnamese', pt: 'vietnamita' },
  tl: { es: 'tagalo', en: 'Tagalog', pt: 'tagalo' },
  eo: { es: 'esperanto', en: 'Esperanto', pt: 'esperanto' },
  tr: { es: 'turco', en: 'Turkish', pt: 'turco' },
  fa: { es: 'persa', en: 'Persian', pt: 'persa' },
  sw: { es: 'suajili', en: 'Swahili', pt: 'suaíli' }
}

export function isSpanish(lang: string): boolean {
  return (lang || '').toLowerCase().split(/[-_]/)[0] === 'es'
}

export function languageRank(lang: string): number {
  return isSpanish(lang) ? 0 : 1
}

export function languageLabel(lang: string, locale: string): string {
  const code = (lang || '').toLowerCase().split(/[-_]/)[0]
  const entry = LANGUAGES[code]
  if (entry) {
    if (locale === 'en') return entry.en
    if (locale === 'pt') return entry.pt
    return entry.es
  }
  return lang || '?'
}
