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

export const MadeByCypherpunks: Localized<string> = {
  en: "Made by cypherpunks",
  zh: "由 cypherpunks 制作",
  hi: "साइफरपंक्स द्वारा बनाया गया",
  es: "Hecho por cypherpunks",
  ar: "صنعها cypherpunks",
  fr: "Fait par des cypherpunks",
  de: "Hergestellt von Cypherpunks",
  ru: "Сделано киберпанками",
  pt: "Feito por cypherpunks",
  ja: "サイファーパンクス製",
  pa: "cypherpunks ਵਲੋਂ ਬਣਾਇਆ ਗਿਆ",
  bn: "cypherpunks দ্বারা তৈরি",
  id: "Dibuat oleh cypherpunks",
  ur: "cypherpunks کی طرف سے بنایا گیا",
  ms: "Dibuat oleh cypherpunks",
  it: "Realizzato da cypherpunks",
  tr: "Cypherpunks tarafından yapıldı",
  ta: "cypherpunks ஆல் உருவாக்கப்பட்டது",
  te: "cypherpunks ద్వారా తయారు",
  ko: "사이퍼펑크가 만듦",
  vi: "Được làm bởi cypherpunks",
  pl: "Zrobione przez cypherpunks",
  ro: "Făcut de cypherpunks",
  nl: "Gemaakt door cypherpunks",
  el: "Φτιαγμένο από cypherpunks",
  th: "ทำโดย cypherpunks",
  cs: "Vytvořeno cypherpunks",
  hu: "Cypherpunks által készítve",
  sv: "Gjord av cypherpunks",
  da: "Lavet af cypherpunks",
}

export const MonetizeAnyWebsite: Localized<string> = {
  en: "Monetize any website",
  zh: "将任何网站货币化",
  hi: "किसी भी वेबसाइट को मुद्रीकृत करें",
  es: "Monetiza cualquier sitio web",
  ar: "تحقيق الربح من أي موقع ويب",
  fr: "Monétisez n'importe quel site web",
  de: "Monetarisieren Sie jede Website",
  ru: "Монетизируйте любой сайт",
  pt: "Monetize qualquer site",
  ja: "どのウェブサイトでも収益化",
  pa: "ਕਿਸੇ ਵੀ ਵੈੱਬਸਾਈਟ ਨੂੰ ਮੁਦਰੀਕਰਨ",
  bn: "যেকোনো ওয়েবসাইট মুদ্রীকরণ",
  id: "Monetisasi situs web apa pun",
  ur: "کسی بھی ویب سائٹ کو سکہ بنانا",
  ms: "Monetize mana-mana laman web",
  it: "Monetizza qualsiasi sito web",
  tr: "Herhangi bir web sitesini paraya çevirin",
  ta: "எந்த வலைத்தளத்தையும் பணம் செய்யவும்",
  te: "ఏ వెబ్‌సైట్‌ను మనీటైజ్ చేయండి",
  ko: "모든 웹 사이트를 화폐화",
  vi: "Kiếm tiền từ bất kỳ trang web nào",
  pl: "Monetyzuj dowolną witrynę",
  ro: "Monetizează orice site web",
  nl: "Monetize elke website",
  el: "Νομισματοποιήστε οποιονδήποτε ιστότοπο",
  th: "หาเงินจากเว็บไซต์ใดก็ได้",
  cs: "Zpeněžte jakýkoli web",
  hu: "Bármely webhely pénzre váltása",
  sv: "Monetarisera vilken webbplats som helst",
  da: "Penge på ethvert websted",
}

export const MonetizeAnyAPI: Localized<string> = {
  en: "Monetize any API",
  zh: "将任何 API 货币化",
  hi: "किसी भी एपीआई को मुद्रीकृत करें",
  es: "Monetiza cualquier API",
  ar: "تحقيق الربح من أي واجهة برمجة تطبيقات",
  fr: "Monétisez n'importe quelle API",
  de: "Monetarisieren Sie jede API",
  ru: "Монетизируйте любой API",
  pt: "Monetize qualquer API",
  ja: "どの API でも収益化",
  pa: "ਕਿਸੇ ਵੀ API ਨੂੰ ਮੁਦਰੀਕਰਨ",
  bn: "যেকোনো API মুদ্রীকরণ",
  id: "Monetisasi API apa pun",
  ur: "کسی بھی API کو سکہ بنانا",
  ms: "Monetize mana-mana API",
  it: "Monetizza qualsiasi API",
  tr: "Herhangi bir API'yi paraya çevirin",
  ta: "எந்த API யையும் பணம் செய்யவும்",
  te: "ఏ API ను మనీటైజ్ చేయండి",
  ko: "모든 API를 화폐화",
  vi: "Kiếm tiền từ bất kỳ API nào",
  pl: "Monetyzuj dowolne API",
  ro: "Monetizează orice API",
  nl: "Monetize elke API",
  el: "Νομισματοποιήστε οποιοδήποτε API",
  th: "หาเงินจาก API ใดก็ได้",
  cs: "Zpeněžte jakýkoli API",
  hu: "Bármely API pénzre váltása",
  sv: "Monetarisera vilken API som helst",
  da: "Penge på ethvert API",
}

export const MonetizeAnyApp: Localized<string> = {
  en: "Monetize any app",
  zh: "将任何应用程序货币化",
  hi: "किसी भी ऐप को मुद्रीकृत करें",
  es: "Monetiza cualquier aplicación",
  ar: "تحقيق الربح من أي تطبيق",
  fr: "Monétisez n'importe quelle application",
  de: "Monetarisieren Sie jede App",
  ru: "Монетизируйте любое приложение",
  pt: "Monetize qualquer aplicativo",
  ja: "どのアプリでも収益化",
  pa: "ਕਿਸੇ ਵੀ ਐਪ ਨੂੰ ਮੁਦਰੀਕਰਨ",
  bn: "যেকোনো অ্যাপ মুদ্রীকরণ",
  id: "Monetisasi aplikasi apa pun",
  ur: "کسی بھی ایپ کو سکہ بنانا",
  ms: "Monetize mana-mana aplikasi",
  it: "Monetizza qualsiasi app",
  tr: "Herhangi bir uygulamayı paraya çevirin",
  ta: "எந்த பயன்பாட்டையும் பணம் செய்யவும்",
  te: "ఏ అప్లికేషన్‌ను మనీటైజ్ చేయండి",
  ko: "모든 앱을 화폐화",
  vi: "Kiếm tiền từ bất kỳ ứng dụng nào",
  pl: "Monetyzuj dowolną aplikację",
  ro: "Monetizează orice aplicație",
  nl: "Monetize elke app",
  el: "Νομισματοποιήστε οποιαδήποτε εφαρμογή",
  th: "หาเงินจากแอปใดก็ได้",
  cs: "Zpeněžte jakoukoli aplikaci",
  hu: "Bármely alkalmazás pénzre váltása",
  sv: "Monetarisera vilken app som helst",
  da: "Penge på ethvert app",
}

export const MonetizeAnyService: Localized<string> = {
  en: "Monetize any service",
  zh: "将任何服务货币化",
  hi: "किसी भी सेवा को मुद्रीकृत करें",
  es: "Monetiza cualquier servicio",
  ar: "تحقيق الربح من أي خدمة",
  fr: "Monétisez n'importe quel service",
  de: "Monetarisieren Sie jeden Service",
  ru: "Монетизируйте любую услугу",
  pt: "Monetize qualquer serviço",
  ja: "どのサービスでも収益化",
  pa: "ਕਿਸੇ ਵੀ ਸੇਵਾ ਨੂੰ ਮੁਦਰੀਕਰਨ",
  bn: "যেকোনো সেবা মুদ্রীকরণ",
  id: "Monetisasi layanan apa pun",
  ur: "کسی بھی خدمت کو سکہ بنانا",
  ms: "Monetize mana-mana perkhidmatan",
  it: "Monetizza qualsiasi servizio",
  tr: "Herhangi bir hizmeti paraya çevirin",
  ta: "எந்த சேவையையும் பணம் செய்யவும்",
  te: "ఏ సేవను మనీటైజ్ చేయండి",
  ko: "모든 서비스를 화폐화",
  vi: "Kiếm tiền từ bất kỳ dịch vụ nào",
  pl: "Monetyzuj dowolną usługę",
  ro: "Monetizează orice serviciu",
  nl: "Monetize elke service",
  el: "Νομισματοποιήστε οποιαδήποτε υπηρεσία",
  th: "หาเงินจากบริการใดก็ได้",
  cs: "Zpeněžte jakoukoli službu",
  hu: "Bármely szolgáltatás pénzre váltása",
  sv: "Monetarisera vilken tjänst som helst",
  da: "Penge på ethvert service",
}

export const MonetizeAnyContent: Localized<string> = {
  en: "Monetize any content",
  zh: "将任何内容货币化",
  hi: "किसी भी सामग्री को मुद्रीकृत करें",
  es: "Monetiza cualquier contenido",
  ar: "تحقيق الربح من أي محتوى",
  fr: "Monétisez n'importe quel contenu",
  de: "Monetarisieren Sie jeden Inhalt",
  ru: "Монетизируйте любое содержимое",
  pt: "Monetize qualquer conteúdo",
  ja: "どのコンテンツでも収益化",
  pa: "ਕਿਸੇ ਵੀ ਸਮੱਗਰੀ ਨੂੰ ਮੁਦਰੀਕਰਨ",
  bn: "যেকোনো কন্টেন্ট মুদ্রীকরণ",
  id: "Monetisasi konten apa pun",
  ur: "کسی بھی مواد کو سکہ بنانا",
  ms: "Monetize mana-mana kandungan",
  it: "Monetizza qualsiasi contenuto",
  tr: "Herhangi bir içeriği paraya çevirin",
  ta: "எந்த உள்ளடக்கத்தையும் பணம் செய்யவும்",
  te: "ఏ కంటెంట్‌ను మనీటైజ్ చేయండి",
  ko: "모든 콘텐츠를 화폐화",
  vi: "Kiếm tiền từ bất kỳ nội dung nào",
  pl: "Monetyzuj dowolną treść",
  ro: "Monetizează orice conținut",
  nl: "Monetize elke inhoud",
  el: "Νομισματοποιήστε οποιοδήποτε περιεχόμενο",
  th: "หาเงินจากเนื้อหาใดก็ได้",
  cs: "Zpeněžte jakýkoli obsah",
  hu: "Bármely tartalom pénzre váltása",
  sv: "Monetarisera vilket innehåll som helst",
  da: "Penge på ethvert indhold",
}

export const MakeYourUsersPayAnonymouslyWithTheirComputation: Localized<string> = {
  en: "Make your users pay anonymously with their computations",
  zh: "让您的用户使用他们的计算机匿名支付",
  hi: "अपने उपयोगकर्ताओं से उनकी गणना के साथ गुमनाम भुगतान करें",
  es: "Haga que sus usuarios paguen de forma anónima con sus cálculos",
  ar: "اجعل مستخدميك يدفعون بشكل مجهول باستخدام حساباتهم",
  fr: "Faites payer vos utilisateurs de manière anonyme avec leurs calculs",
  de: "Lassen Sie Ihre Benutzer anonym mit ihren Berechnungen bezahlen",
  ru: "Позвольте вашим пользователям анонимно платить своими вычислениями",
  pt: "Faça seus usuários pagarem anonimamente com seus cálculos",
  ja: "ユーザーに匿名で計算を使って支払わせる",
  pa: "ਆਪਣੇ ਯੂਜ਼ਰਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਗਣਨਾ ਨਾਲ ਗੁਮਨਾਮੀ ਨਾਲ ਭੁਗਤਾਨ ਕਰਵਾਓ",
  bn: "আপনার ব্যবহারকারীদের তাদের গণনার সাথে অজ্ঞাতে পরিশোধ করান",
  id: "Buat pengguna Anda membayar secara anonim dengan perhitungan mereka",
  ur: "اپنے صارفین کو ان کی حسابات کے ساتھ بے نامی سے ادا کرو",
  ms: "Buat pengguna anda membayar secara anonim dengan pengiraan mereka",
  it: "Fai pagare i tuoi utenti in modo anonimo con i loro calcoli",
  tr: "Kullanıcılarınızın hesaplamalarıyla anonim olarak ödeme yapmalarını sağlayın",
  ta: "உங்கள் பயனர்கள் தங்கள் கணக்குகளுடன் அநாமதேயமாக கட்டணம் செலுத்தவும்",
  te: "మీ వినియోగదారులను తమ లెక్కలతో గుమ్మనామినిగా చెల్లించండి",
  ko: "사용자가 자신의 계산으로 익명으로 지불하도록 만드세요",
  vi: "Làm cho người dùng của bạn trả tiền một cách ẩn danh với các tính toán của họ",
  pl: "Spraw, by Twoi użytkownicy płacili anonimowo za pomocą swoich obliczeń",
  ro: "Faceți ca utilizatorii dvs. să plătească anonim cu calculatoarele lor",
  nl: "Laat uw gebruikers anoniem betalen met hun berekeningen",
  el: "Κάντε τους χρήστες σας να πληρώνουν ανώνυμα με τους υπολογισμούς τους",
  th: "ทำให้ผู้ใช้ของคุณจ่ายเงินอย่างไม่ระบุชื่อด้วยการคำนวณของพวกเขา",
  cs: "Umožněte svým uživatelům platit anonymně s jejich výpočty",
  hu: "Arra kényszeríti a felhasználókat, hogy névtelenül fizessenek a számításaikkal",
  sv: "Låt dina användare betala anonymt med sina beräkningar",
  da: "Få dine brugere til at betale anonymt med deres beregninger",
}

export const Try: Localized<string> = {
  en: "Try it",
  zh: "尝试",
  hi: "कोशिश करें",
  es: "Pruébalo",
  ar: "جرب",
  fr: "Essayer",
  de: "Versuchen",
  ru: "Попробовать",
  pt: "Tente",
  ja: "試してみる",
  pa: "ਕੋਸ਼ਿਸ਼ ਕਰੋ",
  bn: "চেষ্টা করুন",
  id: "Coba",
  ur: "کوشش کریں",
  ms: "Cuba",
  it: "Prova",
  tr: "Deneyin",
  ta: "முயற்சி செய்க",
  te: "ప్రయత్నించండి",
  ko: "시도해보세요",
  vi: "Thử nghiệm",
  pl: "Spróbuj",
  ro: "Încearcă",
  nl: "Probeer het",
  el: "Δοκιμάστε το",
  th: "ลอง",
  cs: "Zkusit",
  hu: "Próbáld ki",
  sv: "Prova",
  da: "Prøv",
}