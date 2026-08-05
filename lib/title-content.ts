import type { StreamingProvider, Title } from "./api/types"
import { REGIONS } from "./api/types"

/**
 * Server-side generation of the original, localized editorial content that
 * accompanies a title page: an availability summary and a FAQ built from the
 * real per-region provider data (not just mirrored TMDB metadata).
 */

export type FaqItem = { question: string; answer: string }

export type TitleLocale = "en" | "es" | "pt-BR"

const DEFAULT_REGION_BY_LOCALE: Record<TitleLocale, string> = {
  en: "US",
  es: "ES",
  "pt-BR": "BR",
}

export function normalizeTitleLocale(locale: string): TitleLocale {
  return locale === "es" || locale === "pt-BR" ? locale : "en"
}

export function defaultRegionForLocale(locale: string): string {
  return DEFAULT_REGION_BY_LOCALE[normalizeTitleLocale(locale)]
}

export function regionDisplayName(code: string, locale: string): string {
  try {
    const display = new Intl.DisplayNames([locale], { type: "region" })
    return display.of(code) ?? code
  } catch {
    return REGIONS.find((r) => r.code === code)?.name ?? code
  }
}

function formatList(names: string[], locale: string): string {
  if (names.length === 0) return ""
  try {
    return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(names)
  } catch {
    return names.join(", ")
  }
}

export function formatCheckedDate(locale: string): string {
  return new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
}

function providerNames(list: StreamingProvider[], types: StreamingProvider["type"][]): string[] {
  const names: string[] = []
  const seen = new Set<string>()
  for (const p of list) {
    if (!types.includes(p.type)) continue
    if (seen.has(p.name)) continue
    seen.add(p.name)
    names.push(p.name)
  }
  return names
}

function regionsWithStreaming(title: Title): string[] {
  return REGIONS.map((r) => r.code).filter((code) => {
    const provs = title.providers[code] ?? []
    return provs.some((p) => p.type === "subscription" || p.type === "free")
  })
}

function regionsOnProvider(title: Title, providerName: string): string[] {
  return REGIONS.map((r) => r.code).filter((code) =>
    (title.providers[code] ?? []).some(
      (p) => p.type === "subscription" && p.name.toLowerCase().includes(providerName.toLowerCase()),
    ),
  )
}

interface Strings {
  sectionCast: string
  sectionSimilar: string
  sectionFaq: string
  directedBy: string
  createdBy: string
  lastChecked: (date: string) => string
  whereQ: (title: string) => string
  whereAStream: (title: string, providers: string, region: string, date: string) => string
  whereARentOnly: (title: string, providers: string, region: string) => string
  whereANone: (title: string, region: string) => string
  netflixQ: (title: string) => string
  netflixAYes: (title: string, region: string, date: string) => string
  netflixAElsewhere: (title: string, region: string, others: string) => string
  netflixANo: (title: string) => string
  netflixANoAlt: (title: string, providers: string, region: string) => string
  rentQ: (title: string) => string
  rentABoth: (title: string, rent: string, buy: string, region: string) => string
  rentARent: (title: string, rent: string, region: string) => string
  rentABuy: (title: string, buy: string, region: string) => string
  rentANone: (title: string, region: string) => string
  countriesQ: (title: string) => string
  countriesA: (title: string, regions: string, date: string) => string
  countriesANone: (title: string) => string
}

const STRINGS: Record<TitleLocale, Strings> = {
  en: {
    sectionCast: "Top cast",
    sectionSimilar: "More like this",
    sectionFaq: "Frequently asked questions",
    directedBy: "Directed by",
    createdBy: "Created by",
    lastChecked: (date) => `Streaming availability last checked on ${date}. Catalogues change frequently — data from TMDB and JustWatch.`,
    whereQ: (title) => `Where can I watch ${title} online?`,
    whereAStream: (title, providers, region, date) =>
      `As of ${date}, ${title} is available to stream on ${providers} in ${region}. Use the country selector above to check availability in other regions — streaming rights are licensed per country, so catalogues differ.`,
    whereARentOnly: (title, providers, region) =>
      `${title} is not currently included with any streaming subscription in ${region}, but you can rent or buy it digitally on ${providers}. Availability differs by country, so it may be on a subscription service elsewhere.`,
    whereANone: (title, region) =>
      `Our sources do not currently list any streaming, rental, or purchase option for ${title} in ${region}. Try switching the country selector — availability is licensed per region and changes often.`,
    netflixQ: (title) => `Is ${title} on Netflix?`,
    netflixAYes: (title, region, date) => `Yes — as of ${date}, ${title} is available on Netflix in ${region}.`,
    netflixAElsewhere: (title, region, others) =>
      `Not in ${region} at the moment. However, ${title} is on Netflix in ${others}. Streaming rights are sold per country, which is why catalogues differ.`,
    netflixANo: (title) => `No — ${title} is not currently on Netflix in any of the countries we track.`,
    netflixANoAlt: (title, providers, region) =>
      `No — ${title} is not currently on Netflix in any of the countries we track. In ${region} it streams on ${providers} instead.`,
    rentQ: (title) => `Can I rent or buy ${title} online?`,
    rentABoth: (title, rent, buy, region) =>
      `Yes. In ${region}, ${title} can be rented on ${rent} and purchased on ${buy}.`,
    rentARent: (title, rent, region) => `Yes. In ${region}, ${title} is available to rent on ${rent}.`,
    rentABuy: (title, buy, region) => `Yes. In ${region}, ${title} is available for digital purchase on ${buy}.`,
    rentANone: (title, region) =>
      `Our sources do not list a digital rental or purchase option for ${title} in ${region} right now.`,
    countriesQ: (title) => `In which countries can I stream ${title}?`,
    countriesA: (title, regions, date) =>
      `As of ${date}, ${title} is included with a streaming subscription (or free with ads) in ${regions}, among the countries we track.`,
    countriesANone: (title) =>
      `${title} is not currently included with a streaming subscription in any of the countries we track, though it may be available to rent or buy digitally.`,
  },
  es: {
    sectionCast: "Reparto principal",
    sectionSimilar: "Títulos similares",
    sectionFaq: "Preguntas frecuentes",
    directedBy: "Dirigida por",
    createdBy: "Creada por",
    lastChecked: (date) => `Disponibilidad verificada por última vez el ${date}. Los catálogos cambian con frecuencia — datos de TMDB y JustWatch.`,
    whereQ: (title) => `¿Dónde puedo ver ${title} online?`,
    whereAStream: (title, providers, region, date) =>
      `A fecha de ${date}, ${title} está disponible en streaming en ${providers} en ${region}. Usa el selector de país para consultar otras regiones — los derechos de streaming se licencian por país, así que los catálogos varían.`,
    whereARentOnly: (title, providers, region) =>
      `${title} no está incluida en ninguna suscripción de streaming en ${region} por ahora, pero puedes alquilarla o comprarla digitalmente en ${providers}. La disponibilidad varía según el país.`,
    whereANone: (title, region) =>
      `Nuestras fuentes no listan actualmente ninguna opción de streaming, alquiler o compra para ${title} en ${region}. Prueba a cambiar el selector de país — la disponibilidad se licencia por región y cambia a menudo.`,
    netflixQ: (title) => `¿Está ${title} en Netflix?`,
    netflixAYes: (title, region, date) => `Sí — a fecha de ${date}, ${title} está disponible en Netflix en ${region}.`,
    netflixAElsewhere: (title, region, others) =>
      `En ${region} no por el momento. Sin embargo, ${title} está en Netflix en ${others}. Los derechos de streaming se venden por país, por eso los catálogos difieren.`,
    netflixANo: (title) => `No — ${title} no está actualmente en Netflix en ninguno de los países que rastreamos.`,
    netflixANoAlt: (title, providers, region) =>
      `No — ${title} no está actualmente en Netflix en ninguno de los países que rastreamos. En ${region} se puede ver en ${providers}.`,
    rentQ: (title) => `¿Puedo alquilar o comprar ${title} online?`,
    rentABoth: (title, rent, buy, region) =>
      `Sí. En ${region}, ${title} se puede alquilar en ${rent} y comprar en ${buy}.`,
    rentARent: (title, rent, region) => `Sí. En ${region}, ${title} está disponible para alquilar en ${rent}.`,
    rentABuy: (title, buy, region) => `Sí. En ${region}, ${title} está disponible para compra digital en ${buy}.`,
    rentANone: (title, region) =>
      `Nuestras fuentes no listan una opción de alquiler o compra digital para ${title} en ${region} en este momento.`,
    countriesQ: (title) => `¿En qué países puedo ver ${title} en streaming?`,
    countriesA: (title, regions, date) =>
      `A fecha de ${date}, ${title} está incluida en una suscripción de streaming (o gratis con anuncios) en ${regions}, entre los países que rastreamos.`,
    countriesANone: (title) =>
      `${title} no está actualmente incluida en ninguna suscripción de streaming en los países que rastreamos, aunque puede estar disponible para alquiler o compra digital.`,
  },
  "pt-BR": {
    sectionCast: "Elenco principal",
    sectionSimilar: "Títulos parecidos",
    sectionFaq: "Perguntas frequentes",
    directedBy: "Direção de",
    createdBy: "Criada por",
    lastChecked: (date) => `Disponibilidade verificada pela última vez em ${date}. Os catálogos mudam com frequência — dados de TMDB e JustWatch.`,
    whereQ: (title) => `Onde assistir ${title} online?`,
    whereAStream: (title, providers, region, date) =>
      `Em ${date}, ${title} está disponível para streaming em ${providers} — considerando o catálogo de ${region}. Use o seletor de país para consultar outras regiões: os direitos de streaming são licenciados por país, então os catálogos variam.`,
    whereARentOnly: (title, providers, region) =>
      `${title} não está incluído em nenhuma assinatura de streaming em ${region} no momento, mas pode ser alugado ou comprado digitalmente em ${providers}. A disponibilidade varia por país.`,
    whereANone: (title, region) =>
      `Nossas fontes não listam nenhuma opção de streaming, aluguel ou compra para ${title} em ${region} no momento. Experimente trocar o seletor de país — a disponibilidade é licenciada por região e muda com frequência.`,
    netflixQ: (title) => `${title} está na Netflix?`,
    netflixAYes: (title, region, date) => `Sim — em ${date}, ${title} está disponível na Netflix em ${region}.`,
    netflixAElsewhere: (title, region, others) =>
      `Em ${region}, não por enquanto. No entanto, ${title} está na Netflix em ${others}. Os direitos de streaming são vendidos por país, por isso os catálogos são diferentes.`,
    netflixANo: (title) => `Não — ${title} não está na Netflix em nenhum dos países que acompanhamos no momento.`,
    netflixANoAlt: (title, providers, region) =>
      `Não — ${title} não está na Netflix em nenhum dos países que acompanhamos. Em ${region}, dá para assistir em ${providers}.`,
    rentQ: (title) => `Dá para alugar ou comprar ${title} online?`,
    rentABoth: (title, rent, buy, region) =>
      `Sim. Em ${region}, ${title} pode ser alugado em ${rent} e comprado em ${buy}.`,
    rentARent: (title, rent, region) => `Sim. Em ${region}, ${title} está disponível para aluguel em ${rent}.`,
    rentABuy: (title, buy, region) => `Sim. Em ${region}, ${title} está disponível para compra digital em ${buy}.`,
    rentANone: (title, region) =>
      `Nossas fontes não listam opção de aluguel ou compra digital para ${title} em ${region} no momento.`,
    countriesQ: (title) => `Em quais países ${title} está disponível em streaming?`,
    countriesA: (title, regions, date) =>
      `Em ${date}, ${title} está incluído em uma assinatura de streaming (ou grátis com anúncios) em ${regions}, entre os países que acompanhamos.`,
    countriesANone: (title) =>
      `${title} não está incluído em nenhuma assinatura de streaming nos países que acompanhamos, mas pode estar disponível para aluguel ou compra digital.`,
  },
}

export function getTitleStrings(locale: string): Strings {
  return STRINGS[normalizeTitleLocale(locale)]
}

export function buildTitleFaq(
  title: Title,
  region: string,
  locale: string,
  checkedDate: string,
): FaqItem[] {
  const s = getTitleStrings(locale)
  const regionName = regionDisplayName(region, locale)
  const provs = title.providers[region] ?? []

  const streamNames = providerNames(provs, ["subscription", "free"])
  const rentNames = providerNames(provs, ["rent"])
  const buyNames = providerNames(provs, ["buy"])

  const faq: FaqItem[] = []

  // 1. Where can I watch it?
  if (streamNames.length > 0) {
    faq.push({
      question: s.whereQ(title.title),
      answer: s.whereAStream(title.title, formatList(streamNames, locale), regionName, checkedDate),
    })
  } else if (rentNames.length > 0 || buyNames.length > 0) {
    const all = [...new Set([...rentNames, ...buyNames])]
    faq.push({
      question: s.whereQ(title.title),
      answer: s.whereARentOnly(title.title, formatList(all, locale), regionName),
    })
  } else {
    faq.push({
      question: s.whereQ(title.title),
      answer: s.whereANone(title.title, regionName),
    })
  }

  // 2. Is it on Netflix?
  const netflixHere = streamNames.some((n) => n.toLowerCase().includes("netflix"))
  if (netflixHere) {
    faq.push({
      question: s.netflixQ(title.title),
      answer: s.netflixAYes(title.title, regionName, checkedDate),
    })
  } else {
    const netflixRegions = regionsOnProvider(title, "netflix").filter((c) => c !== region)
    if (netflixRegions.length > 0) {
      const names = netflixRegions.slice(0, 6).map((c) => regionDisplayName(c, locale))
      faq.push({
        question: s.netflixQ(title.title),
        answer: s.netflixAElsewhere(title.title, regionName, formatList(names, locale)),
      })
    } else if (streamNames.length > 0) {
      faq.push({
        question: s.netflixQ(title.title),
        answer: s.netflixANoAlt(title.title, formatList(streamNames, locale), regionName),
      })
    } else {
      faq.push({ question: s.netflixQ(title.title), answer: s.netflixANo(title.title) })
    }
  }

  // 3. Rent or buy?
  if (rentNames.length > 0 && buyNames.length > 0) {
    faq.push({
      question: s.rentQ(title.title),
      answer: s.rentABoth(
        title.title,
        formatList(rentNames, locale),
        formatList(buyNames, locale),
        regionName,
      ),
    })
  } else if (rentNames.length > 0) {
    faq.push({
      question: s.rentQ(title.title),
      answer: s.rentARent(title.title, formatList(rentNames, locale), regionName),
    })
  } else if (buyNames.length > 0) {
    faq.push({
      question: s.rentQ(title.title),
      answer: s.rentABuy(title.title, formatList(buyNames, locale), regionName),
    })
  } else {
    faq.push({ question: s.rentQ(title.title), answer: s.rentANone(title.title, regionName) })
  }

  // 4. Which countries?
  const streamRegions = regionsWithStreaming(title)
  if (streamRegions.length > 0) {
    const names = streamRegions.map((c) => regionDisplayName(c, locale))
    faq.push({
      question: s.countriesQ(title.title),
      answer: s.countriesA(title.title, formatList(names, locale), checkedDate),
    })
  } else {
    faq.push({ question: s.countriesQ(title.title), answer: s.countriesANone(title.title) })
  }

  return faq
}
