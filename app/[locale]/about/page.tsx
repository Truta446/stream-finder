import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { LegalLayout } from "@/components/stream-finder/legal-layout"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"

type AboutContent = {
  metaTitle: string
  metaDescription: string
  title: string
  whatTitle: string
  what: string[]
  howTitle: string
  how: string[]
  editorialTitle: string
  editorial: string[]
  notTitle: string
  not: string[]
  whoTitle: string
  who: string[]
  linksTitle: string
  contactLabel: string
  blogLabel: string
  privacyLabel: string
  termsLabel: string
}

const CONTENT: Record<string, AboutContent> = {
  en: {
    metaTitle: "About ReelHuntr — who we are and how the data works",
    metaDescription:
      "ReelHuntr is an independent streaming search engine. Learn who runs it, where the availability data comes from, and how we keep it accurate.",
    title: "About ReelHuntr",
    whatTitle: "What ReelHuntr is",
    what: [
      "ReelHuntr is a free streaming search engine. You type the name of a movie or TV show, and it tells you every legal platform where that title can be streamed, rented, or bought — in your country. It covers Netflix, Prime Video, Disney+, Max, Apple TV+, Paramount+ and dozens of other services across 14 countries.",
      "The project was born from a very ordinary frustration: wanting to watch a specific film on a Friday night and spending twenty minutes opening app after app to figure out where it was available. Streaming rights are licensed per country and change constantly, so the answer to \"where can I watch this?\" is genuinely hard to keep track of. ReelHuntr exists to answer that one question well.",
    ],
    howTitle: "Where the data comes from",
    how: [
      "Streaming availability is sourced from TMDB (The Movie Database) and its JustWatch-powered watch-provider data, with OMDb as a metadata fallback. Availability is re-checked continuously as pages are refreshed; every title page shows the date the data was last verified.",
      "Because rights change without notice, no availability database is ever perfect. When our sources don't list a title in your country, we say so explicitly rather than guessing — and we link you to places where you can double-check.",
      "ReelHuntr uses the TMDB and JustWatch APIs but is not endorsed or certified by TMDB, JustWatch, or any streaming platform.",
    ],
    editorialTitle: "Our editorial content",
    editorial: [
      "Alongside the search engine, we publish guides on the ReelHuntr blog: explainers on how streaming licensing actually works, frameworks for deciding what's worth paying for, and curated watchlists. Every article is written by us — no scraped or AI-spun filler — and each post shows its publication date and author.",
    ],
    notTitle: "What we don't do",
    not: [
      "ReelHuntr does not host, stream, or link to pirated content, ever. We only point to licensed platforms. We don't require accounts, we don't sell your data, and we keep tracking to the minimum needed to run the site (see the privacy policy for details).",
    ],
    whoTitle: "Who runs this",
    who: [
      "ReelHuntr is built and maintained by Juan Versolato, a software developer from Brazil, as an independent project. There's no media company behind it — one person, a code editor, and a mild obsession with not wasting time deciding what to watch. Feedback, corrections, and suggestions are genuinely welcome via the contact page.",
    ],
    linksTitle: "Useful links",
    contactLabel: "Contact",
    blogLabel: "Blog",
    privacyLabel: "Privacy Policy",
    termsLabel: "Terms of Use",
  },
  es: {
    metaTitle: "Sobre ReelHuntr — quiénes somos y cómo funcionan los datos",
    metaDescription:
      "ReelHuntr es un buscador de streaming independiente. Conoce quién lo mantiene, de dónde vienen los datos de disponibilidad y cómo los mantenemos precisos.",
    title: "Sobre ReelHuntr",
    whatTitle: "Qué es ReelHuntr",
    what: [
      "ReelHuntr es un buscador de streaming gratuito. Escribes el nombre de una película o serie y te muestra todas las plataformas legales donde ese título se puede ver, alquilar o comprar — en tu país. Cubre Netflix, Prime Video, Disney+, Max, Apple TV+, Paramount+ y decenas de servicios más en 14 países.",
      "El proyecto nació de una frustración muy común: querer ver una película concreta un viernes por la noche y pasar veinte minutos abriendo aplicación tras aplicación para averiguar dónde estaba disponible. Los derechos de streaming se licencian por país y cambian constantemente, así que la respuesta a \"¿dónde puedo ver esto?\" es difícil de seguir. ReelHuntr existe para responder bien a esa única pregunta.",
    ],
    howTitle: "De dónde vienen los datos",
    how: [
      "La disponibilidad de streaming proviene de TMDB (The Movie Database) y de sus datos de proveedores impulsados por JustWatch, con OMDb como respaldo de metadatos. La disponibilidad se verifica continuamente al actualizar las páginas; cada página de título muestra la fecha de la última verificación.",
      "Como los derechos cambian sin previo aviso, ninguna base de datos de disponibilidad es perfecta. Cuando nuestras fuentes no listan un título en tu país, lo decimos explícitamente en lugar de adivinar — y te enlazamos a sitios donde puedes verificarlo.",
      "ReelHuntr usa las APIs de TMDB y JustWatch pero no está avalado ni certificado por TMDB, JustWatch ni ninguna plataforma de streaming.",
    ],
    editorialTitle: "Nuestro contenido editorial",
    editorial: [
      "Junto al buscador, publicamos guías en el blog de ReelHuntr: explicaciones sobre cómo funciona realmente el licenciamiento de streaming, criterios para decidir qué vale la pena pagar y listas seleccionadas. Cada artículo está escrito por nosotros — sin relleno copiado ni generado en masa — y cada publicación muestra su fecha y autor.",
    ],
    notTitle: "Lo que no hacemos",
    not: [
      "ReelHuntr no aloja, transmite ni enlaza contenido pirata, nunca. Solo apuntamos a plataformas con licencia. No requerimos cuentas, no vendemos tus datos y mantenemos el rastreo al mínimo necesario para operar el sitio (consulta la política de privacidad para más detalles).",
    ],
    whoTitle: "Quién está detrás",
    who: [
      "ReelHuntr es creado y mantenido por Juan Versolato, desarrollador de software de Brasil, como proyecto independiente. No hay una empresa de medios detrás — una persona, un editor de código y una leve obsesión con no perder tiempo decidiendo qué ver. Los comentarios, correcciones y sugerencias son bienvenidos a través de la página de contacto.",
    ],
    linksTitle: "Enlaces útiles",
    contactLabel: "Contacto",
    blogLabel: "Blog",
    privacyLabel: "Política de privacidad",
    termsLabel: "Términos de uso",
  },
  "pt-BR": {
    metaTitle: "Sobre o ReelHuntr — quem somos e como os dados funcionam",
    metaDescription:
      "O ReelHuntr é um buscador de streaming independente. Saiba quem mantém o projeto, de onde vêm os dados de disponibilidade e como os mantemos precisos.",
    title: "Sobre o ReelHuntr",
    whatTitle: "O que é o ReelHuntr",
    what: [
      "O ReelHuntr é um buscador de streaming gratuito. Você digita o nome de um filme ou série e ele mostra todas as plataformas legais onde aquele título pode ser assistido, alugado ou comprado — no seu país. Cobre Netflix, Prime Video, Disney+, Max, Apple TV+, Paramount+ e dezenas de outros serviços em 14 países.",
      "O projeto nasceu de uma frustração muito comum: querer assistir a um filme específico numa sexta à noite e passar vinte minutos abrindo aplicativo atrás de aplicativo para descobrir onde ele estava disponível. Os direitos de streaming são licenciados por país e mudam o tempo todo, então a resposta para \"onde assisto isso?\" é genuinamente difícil de acompanhar. O ReelHuntr existe para responder bem a essa única pergunta.",
    ],
    howTitle: "De onde vêm os dados",
    how: [
      "A disponibilidade de streaming vem do TMDB (The Movie Database) e dos seus dados de provedores alimentados pelo JustWatch, com o OMDb como reserva de metadados. A disponibilidade é reverificada continuamente conforme as páginas são atualizadas; cada página de título mostra a data da última verificação.",
      "Como os direitos mudam sem aviso, nenhuma base de disponibilidade é perfeita. Quando nossas fontes não listam um título no seu país, dizemos isso explicitamente em vez de chutar — e indicamos onde você pode confirmar.",
      "O ReelHuntr usa as APIs do TMDB e do JustWatch, mas não é endossado nem certificado pelo TMDB, JustWatch ou qualquer plataforma de streaming.",
    ],
    editorialTitle: "Nosso conteúdo editorial",
    editorial: [
      "Além do buscador, publicamos guias no blog do ReelHuntr: explicações sobre como o licenciamento de streaming realmente funciona, critérios para decidir o que vale a pena assinar e listas selecionadas. Todos os artigos são escritos por nós — sem conteúdo raspado ou gerado em massa — e cada publicação mostra data e autor.",
    ],
    notTitle: "O que não fazemos",
    not: [
      "O ReelHuntr não hospeda, transmite nem cria links para conteúdo pirata, nunca. Só apontamos para plataformas licenciadas. Não exigimos cadastro, não vendemos seus dados e mantemos o rastreamento no mínimo necessário para operar o site (veja a política de privacidade para detalhes).",
    ],
    whoTitle: "Quem faz",
    who: [
      "O ReelHuntr é construído e mantido por Juan Versolato, desenvolvedor de software do Brasil, como projeto independente. Não há uma empresa de mídia por trás — uma pessoa, um editor de código e uma leve obsessão em não perder tempo decidindo o que assistir. Feedback, correções e sugestões são muito bem-vindos pela página de contato.",
    ],
    linksTitle: "Links úteis",
    contactLabel: "Contato",
    blogLabel: "Blog",
    privacyLabel: "Política de privacidade",
    termsLabel: "Termos de uso",
  },
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const c = CONTENT[locale] ?? CONTENT.en
  const canonical = locale === "en" ? "/about" : `/${locale}/about`
  return {
    title: `${c.metaTitle}`,
    description: c.metaDescription,
    alternates: {
      canonical,
      languages: {
        en: "/about",
        es: "/es/about",
        "pt-BR": "/pt-BR/about",
        "x-default": "/about",
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title: c.metaTitle,
      description: c.metaDescription,
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = CONTENT[locale] ?? CONTENT.en
  const prefix = locale === "en" ? "" : `/${locale}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: c.title,
    url: `${SITE_URL}${prefix}/about`,
    mainEntity: {
      "@type": "WebSite",
      name: "ReelHuntr",
      url: SITE_URL,
      author: { "@type": "Person", name: "Juan Versolato" },
    },
  }

  return (
    <LegalLayout title={c.title} lastUpdated="August 4, 2026" locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="text-muted-foreground space-y-10">
        <Section title={c.whatTitle} paragraphs={c.what} />
        <Section title={c.howTitle} paragraphs={c.how} />
        <Section title={c.editorialTitle} paragraphs={c.editorial} />
        <Section title={c.notTitle} paragraphs={c.not} />
        <Section title={c.whoTitle} paragraphs={c.who} />

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{c.linksTitle}</h2>
          <div className="flex flex-wrap gap-4">
            <PageLink href={`${prefix}/contact`} label={c.contactLabel} />
            <PageLink href={`${prefix}/blog`} label={c.blogLabel} />
            <PageLink href={`${prefix}/privacy-policy`} label={c.privacyLabel} />
            <PageLink href={`${prefix}/terms`} label={c.termsLabel} />
          </div>
        </section>
      </div>
    </LegalLayout>
  )
}

function Section({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-4">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>
    </section>
  )
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
    >
      {label}
    </Link>
  )
}
