import { Records } from "@/libs/records"

export const codes = [
  "en",
  "zh",
  "hi",
  "es",
  "ar",
  "fr",
  "de",
  "ru",
  "pt",
  "ja",
  "pa",
  "bn",
  "id",
  "ur",
  "ms",
  "it",
  "tr",
  "ta",
  "te",
  "ko",
  "vi",
  "pl",
  "ro",
  "nl",
  "el",
  "th",
  "cs",
  "hu",
  "sv",
  "da",
] as const

export const direction = {
  en: "ltr",
  zh: "ltr",
  hi: "ltr",
  es: "ltr",
  ar: "rtl",
  fr: "ltr",
  de: "ltr",
  ru: "ltr",
  pt: "ltr",
  ja: "ltr",
  pa: "ltr",
  bn: "ltr",
  id: "ltr",
  ur: "rtl",
  ms: "ltr",
  it: "ltr",
  tr: "ltr",
  ta: "ltr",
  te: "ltr",
  ko: "ltr",
  vi: "ltr",
  pl: "ltr",
  ro: "ltr",
  nl: "ltr",
  el: "ltr",
  th: "ltr",
  cs: "ltr",
  hu: "ltr",
  sv: "ltr",
  da: "ltr",
} as const

export type Localized<T> = {
  [key in typeof codes[number]]: T
}

export function get<T>(localized: Localized<T>, locale: string): T {
  const result = Records.getOrNull(localized, locale)

  if (result != null)
    return result

  return localized["en"]
}

export const TechnologiesToHideYourselfInPlainSight: Localized<string> = {
  en: "Technologies to hide yourself in plain sight",
  zh: "在明处隐藏自己的技术",
  hi: "सामने छुपने के लिए तकनीक",
  es: "Tecnologías para esconderse a plena vista",
  ar: "تقنيات لإخفاء نفسك في الوضوح",
  fr: "Technologies pour vous cacher à la vue de tous",
  de: "Technologien, um sich offen zu verstecken",
  ru: "Технологии, чтобы скрыться на виду",
  pt: "Tecnologias para se esconder à vista de todos",
  ja: "目立たないように自分を隠すための技術",
  pa: "ਸਾਫ ਦਿਖਾਈ ਵਿੱਚ ਆਪਣੇ ਆਪ ਨੂੰ ਛੁਪਾਉਣ ਲਈ ਤਕਨੀਕ",
  bn: "প্রকাশে নিজেকে লুকানোর প্রযুক্তি",
  id: "Teknologi untuk menyembunyikan diri di depan umum",
  ur: "صاف دکھائی میں خود کو چھپانے کی تکنیک",
  ms: "Teknologi untuk menyembunyikan diri di tempat terang",
  it: "Tecnologie per nascondersi alla vista di tutti",
  tr: "Açıkta kendini gizlemek için teknolojiler",
  ta: "பொதுவாக மறைக்க தெரியும் தொழில்நுட்பங்கள்",
  te: "ప్రకటనలో నిజాయితీకరించడానికి సాధనాలు",
  ko: "눈에 띄지 않게 자신을 숨기는 기술",
  vi: "Công nghệ để ẩn mình trong tầm nhìn",
  pl: "Technologie, aby schować się na widoku",
  ro: "Tehnologii pentru a te ascunde în plină vedere",
  nl: "Technologieën om jezelf in het zicht te verbergen",
  el: "Τεχνολογίες για να κρυφτείτε στην απλή όψη",
  th: "เทคโนโลยีในการซ่อนตัวในที่สาธารณะ",
  cs: "Technologie, jak se skrýt na očích",
  hu: "Technológiák, hogy elrejtsd magad a szem elől",
  sv: "Tekniker för att gömma sig i vanlig syn",
  da: "Teknologier for at skjule dig selv i almindelig syn",
}
