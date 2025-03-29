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

export const SuperGenerator2048: Localized<string> = {
  en: "Super Generator 2048",
  zh: "超级生成器 2048",
  hi: "सुपर जेनरेटर 2048",
  es: "Super Generador 2048",
  ar: "مولد سوبر 2048",
  fr: "Super Générateur 2048",
  de: "Super Generator 2048",
  ru: "Супергенератор 2048",
  pt: "Super Gerador 2048",
  ja: "スーパージェネレーター 2048",
  pa: "ਸੁਪਰ ਜਨਰੇਟਰ 2048",
  bn: "সুপার জেনারেটর 2048",
  id: "Super Generator 2048",
  ur: "سپر جنریٹر 2048",
  ms: "Super Generator 2048",
  it: "Super Generatore 2048",
  tr: "Süper Jeneratör 2048",
  ta: "சூப்பர் உருவாக்கி 2048",
  te: "సూపర్ జనరేటర్ 2048",
  ko: "슈퍼 생성기 2048",
  vi: "Siêu máy phát điện 2048",
  pl: "Super Generator 2048",
  ro: "Super Generator 2048",
  nl: "Super Generator 2048",
  el: "Υπεργεννήτρια 2048",
  th: "เจนเนอเรเตอร์ 2048",
  cs: "Super Generátor 2048",
  hu: "Szuper Generátor 2048",
  sv: "Super Generator 2048",
  da: "Super Generator 2048",
}

export const Generate: Localized<string> = {
  en: "Generate",
  zh: "生成",
  hi: "उत्पन्न करें",
  es: "Generar",
  ar: "توليد",
  fr: "Générer",
  de: "Generieren",
  ru: "Генерировать",
  pt: "Gerar",
  ja: "生成する",
  pa: "ਉਤਪੰਨ",
  bn: "উৎপাদন",
  id: "Menghasilkan",
  ur: "پیدا کریں",
  ms: "Hasilkan",
  it: "Generare",
  tr: "Oluşturmak",
  ta: "உருவாக்க",
  te: "రూపొందించు",
  ko: "생성",
  vi: "Tạo ra",
  pl: "Generować",
  ro: "Genera",
  nl: "Genereren",
  el: "Δημιουργώ",
  th: "สร้าง",
  cs: "Generovat",
  hu: "Generál",
  sv: "Generera",
  da: "Generere",
}

export const Generating: Localized<string> = {
  en: "Generating",
  zh: "生成中",
  hi: "उत्पन्न हो रहा है",
  es: "Generando",
  ar: "جاري التوليد",
  fr: "Génération",
  de: "Generieren",
  ru: "Генерация",
  pt: "Gerando",
  ja: "生成中",
  pa: "ਉਤਪੰਨ",
  bn: "উৎপাদন",
  id: "Menghasilkan",
  ur: "پیدا کرنا",
  ms: "Menghasilkan",
  it: "Generando",
  tr: "Oluşturuluyor",
  ta: "உருவாக்குகின்றது",
  te: "రూపొందిస్తున్నది",
  ko: "생성 중",
  vi: "Đang tạo",
  pl: "Generowanie",
  ro: "Generare",
  nl: "Genereren",
  el: "Δημιουργείται",
  th: "กำลังสร้าง",
  cs: "Generování",
  hu: "Generálás",
  sv: "Genererar",
  da: "Genererer",
}

export const YouGeneratedX: Localized<(x: string) => string> = {
  en: (x) => `You generated ${x}`,
  zh: (x) => `您生成了 ${x}`,
  hi: (x) => `आपने ${x} उत्पन्न किया`,
  es: (x) => `Generaste ${x}`,
  ar: (x) => `لقد قمت بتوليد ${x}`,
  fr: (x) => `Vous avez généré ${x}`,
  de: (x) => `Sie haben ${x} generiert`,
  ru: (x) => `Вы сгенерировали ${x}`,
  pt: (x) => `Você gerou ${x}`,
  ja: (x) => `${x} を生成しました`,
  pa: (x) => `ਤੁਸੀਂ ${x} ਉਤਪੰਨ ਕੀਤਾ`,
  bn: (x) => `আপনি ${x} উৎপাদন করেছেন`,
  id: (x) => `Anda menghasilkan ${x}`,
  ur: (x) => `آپ نے ${x} پیدا کیا`,
  ms: (x) => `Anda telah menghasilkan ${x}`,
  it: (x) => `Hai generato ${x}`,
  tr: (x) => `${x} oluşturdunuz`,
  ta: (x) => `நீங்கள் ${x} உருவாக்கினீர்கள்`,
  te: (x) => `మీరు ${x} రూపొందించారు`,
  ko: (x) => `${x}를 생성했습니다`,
  vi: (x) => `Bạn đã tạo ra ${x}`,
  pl: (x) => `Wygenerowałeś ${x}`,
  ro: (x) => `Ai generat ${x}`,
  nl: (x) => `U heeft ${x} gegenereerd`,
  el: (x) => `Δημιουργήσατε ${x}`,
  th: (x) => `คุณสร้าง ${x}`,
  cs: (x) => `Vy jste vygenerovali ${x}`,
  hu: (x) => `Létrehoztál ${x}`,
  sv: (x) => `Du genererade ${x}`,
  da: (x) => `Du genererede ${x}`,
}

export const YouEarnedX: Localized<(x: string) => string> = {
  en: (x) => `You earned ${x}`,
  zh: (x) => `您赚取了 ${x}`,
  hi: (x) => `आपने ${x} कमाया`,
  es: (x) => `Ganaste ${x}`,
  ar: (x) => `كسبت ${x}`,
  fr: (x) => `Vous avez gagné ${x}`,
  de: (x) => `Sie haben ${x} verdient`,
  ru: (x) => `Вы заработали ${x}`,
  pt: (x) => `Você ganhou ${x}`,
  ja: (x) => `${x} を獲得しました`,
  pa: (x) => `ਤੁਸੀਂ ${x} ਕਮਾਈ`,
  bn: (x) => `আপনি ${x} আয় করেছেন`,
  id: (x) => `Anda mendapat ${x}`,
  ur: (x) => `آپ نے ${x} کمایا`,
  ms: (x) => `Anda telah memperoleh ${x}`,
  it: (x) => `Hai guadagnato ${x}`,
  tr: (x) => `${x} kazandınız`,
  ta: (x) => `நீங்கள் ${x} சம்பாதித்தீர்கள்`,
  te: (x) => `మీరు ${x} సంపాదించారు`,
  ko: (x) => `${x}를 벌었습니다`,
  vi: (x) => `Bạn đã kiếm được ${x}`,
  pl: (x) => `Zarobiłeś ${x}`,
  ro: (x) => `Ai câștigat ${x}`,
  nl: (x) => `U heeft ${x} verdiend`,
  el: (x) => `Κερδίσατε ${x}`,
  th: (x) => `คุณได้รับ ${x}`,
  cs: (x) => `Vydělali jste ${x}`,
  hu: (x) => `Összesen ${x} keresett`,
  sv: (x) => `Du tjänade ${x}`,
  da: (x) => `Du tjente ${x}`,
}

export const Settings: Localized<string> = {
  en: "Settings",
  zh: "设置",
  hi: "सेटिंग्स",
  es: "Configuración",
  ar: "الإعدادات",
  fr: "Paramètres",
  de: "Einstellungen",
  ru: "Настройки",
  pt: "Configurações",
  ja: "設定",
  pa: "ਸੈਟਿੰਗਾਂ",
  bn: "সেটিংস",
  id: "Pengaturan",
  ur: "ترتیبات",
  ms: "Tetapan",
  it: "Impostazioni",
  tr: "Ayarlar",
  ta: "அமைப்புகள்",
  te: "అమరికలు",
  ko: "설정",
  vi: "Cài đặt",
  pl: "Ustawienia",
  ro: "Setări",
  nl: "Instellingen",
  el: "Ρυθμίσεις",
  th: "การตั้งค่า",
  cs: "Nastavení",
  hu: "Beállítások",
  sv: "Inställningar",
  da: "Indstillinger",
}

export const Enabled: Localized<string> = {
  en: "Enabled",
  zh: "已启用",
  hi: "सक्षम",
  es: "Habilitado",
  ar: "مفعل",
  fr: "Activé",
  de: "Aktiviert",
  ru: "Включено",
  pt: "Habilitado",
  ja: "有効",
  pa: "ਚਾਲੂ",
  bn: "সক্রিয়",
  id: "Diaktifkan",
  ur: "فعال",
  ms: "Diaktifkan",
  it: "Abilitato",
  tr: "Etkin",
  ta: "இயக்கப்பட்டது",
  te: "ప్రారంభించబడింది",
  ko: "활성화됨",
  vi: "Đã bật",
  pl: "Włączone",
  ro: "Activat",
  nl: "Ingeschakeld",
  el: "Ενεργοποιημένο",
  th: "เปิดใช้งาน",
  cs: "Povoleno",
  hu: "Engedélyezve",
  sv: "Aktiverad",
  da: "Aktiveret",
}

export const Value: Localized<string> = {
  en: "Value",
  zh: "值",
  hi: "मान",
  es: "Valor",
  ar: "القيمة",
  fr: "Valeur",
  de: "Wert",
  ru: "Значение",
  pt: "Valor",
  ja: "値",
  pa: "ਮੁੱਲ",
  bn: "মান",
  id: "Nilai",
  ur: "قیمت",
  ms: "Nilai",
  it: "Valore",
  tr: "Değer",
  ta: "மதிப்பு",
  te: "విలువ",
  ko: "값",
  vi: "Giá trị",
  pl: "Wartość",
  ro: "Valoare",
  nl: "Waarde",
  el: "Τιμή",
  th: "ค่า",
  cs: "Hodnota",
  hu: "Érték",
  sv: "Värde",
  da: "Værdi",
}

export const Wallet: Localized<string> = {
  en: "Wallet",
  zh: "钱包",
  hi: "बटुआ",
  es: "Billetera",
  ar: "محفظة",
  fr: "Portefeuille",
  de: "Brieftasche",
  ru: "Кошелек",
  pt: "Carteira",
  ja: "財布",
  pa: "ਬਟਵਾ",
  bn: "ওয়ালেট",
  id: "Dompet",
  ur: "بٹوہ",
  ms: "Dompet",
  it: "Portafoglio",
  tr: "Cüzdan",
  ta: "பணப்பை",
  te: "బ్యాంక్ ఖాతా",
  ko: "지갑",
  vi: "Ví",
  pl: "Portfel",
  ro: "Portofel",
  nl: "Portemonnee",
  el: "Πορτοφόλι",
  th: "กระเป๋าเงิน",
  cs: "Peněženka",
  hu: "Pénztárca",
  sv: "Plånbok",
  da: "Pung",
}

export const Address: Localized<string> = {
  en: "Address",
  zh: "地址",
  hi: "पता",
  es: "Dirección",
  ar: "العنوان",
  fr: "Adresse",
  de: "Adresse",
  ru: "Адрес",
  pt: "Endereço",
  ja: "住所",
  pa: "ਪਤਾ",
  bn: "ঠিকানা",
  id: "Alamat",
  ur: "پتہ",
  ms: "Alamat",
  it: "Indirizzo",
  tr: "Adres",
  ta: "முகவரி",
  te: "చిరునామా",
  ko: "주소",
  vi: "Địa chỉ",
  pl: "Adres",
  ro: "Adresă",
  nl: "Adres",
  el: "Διεύθυνση",
  th: "ที่อยู่",
  cs: "Adresa",
  hu: "Cím",
  sv: "Adress",
  da: "Adresse",
}

export const PrivateKey: Localized<string> = {
  en: "Private Key",
  zh: "私钥",
  hi: "निजी कुंजी",
  es: "Clave privada",
  ar: "المفتاح الخاص",
  fr: "Clé privée",
  de: "Privater Schlüssel",
  ru: "Закрытый ключ",
  pt: "Chave privada",
  ja: "秘密鍵",
  pa: "ਨਿੱਜੀ ਕੁੰਜੀ",
  bn: "গোপন কী",
  id: "Kunci pribadi",
  ur: "نجی چابی",
  ms: "Kunci peribadi",
  it: "Chiave privata",
  tr: "Özel anahtar",
  ta: "தனிப்பட்ட விசை",
  te: "ప్రైవేట్ కీ",
  ko: "개인 키",
  vi: "Khóa riêng tư",
  pl: "Prywatny klucz",
  ro: "Cheie privată",
  nl: "Privésleutel",
  el: "Ιδιωτικό κλειδί",
  th: "กุญแจส่วนตัว",
  cs: "Soukromý klíč",
  hu: "Privát kulcs",
  sv: "Privat nyckel",
  da: "Privat nøgle",
}

export const GenerateANewWallet: Localized<string> = {
  en: "Generate a new wallet",
  zh: "生成一个新钱包",
  hi: "एक नया बटुआ बनाएं",
  es: "Generar una nueva billetera",
  ar: "إنشاء محفظة جديدة",
  fr: "Générer un nouveau portefeuille",
  de: "Eine neue Brieftasche erstellen",
  ru: "Создать новый кошелек",
  pt: "Gerar uma nova carteira",
  ja: "新しい財布を生成する",
  pa: "ਇੱਕ ਨਵਾਂ ਬਟਵਾ ਬਣਾਓ",
  bn: "একটি নতুন ওয়ালেট তৈরি করুন",
  id: "Buat dompet baru",
  ur: "نیا بٹوہ بنائیں",
  ms: "Hasilkan dompet baru",
  it: "Genera un nuovo portafoglio",
  tr: "Yeni bir cüzdan oluşturun",
  ta: "புதிய பணப்பையை உருவாக்கவும்",
  te: "కొత్త వాలెట్ రూపొందించండి",
  ko: "새 지갑 생성",
  vi: "Tạo ví mới",
  pl: "Wygeneruj nowy portfel",
  ro: "Generați un portofel nou",
  nl: "Genereer een nieuwe portemonnee",
  el: "Δημιουργήστε ένα νέο πορτοφόλι",
  th: "สร้างกระเป๋าเงินใหม่",
  cs: "Vytvořit novou peněženku",
  hu: "Új pénztárca létrehozása",
  sv: "Skapa en ny plånbok",
  da: "Opret en ny pung",
}

export const ImportAnExistingWallet: Localized<string> = {
  en: "Import an existing wallet",
  zh: "导入现有钱包",
  hi: "एक मौजूदा बटुआ आयात करें",
  es: "Importar una billetera existente",
  ar: "استيراد محفظة موجودة",
  fr: "Importer un portefeuille existant",
  de: "Importieren Sie eine vorhandene Brieftasche",
  ru: "Импортировать существующий кошелек",
  pt: "Importar uma carteira existente",
  ja: "既存の財布をインポートする",
  pa: "ਇੱਕ ਮੌਜੂਦਾ ਬਟਵਾ ਆਯਾਤ ਕਰੋ",
  bn: "একটি বিদ্যমান ওয়ালেট আমদানি করুন",
  id: "Impor dompet yang ada",
  ur: "ایک موجودہ بٹوہ درآمد کریں",
  ms: "Import dompet yang ada",
  it: "Importa un portafoglio esistente",
  tr: "Mevcut bir cüzdanı içe aktarın",
  ta: "ஒரு உள்ளூர் பணப்பையை இறக்குமதி செய்யவும்",
  te: "ఒక ఉన్న వాలెట్‌ను దిగుమతి చేసుకోండి",
  ko: "기존 지갑 가져오기",
  vi: "Nhập ví hiện có",
  pl: "Importuj istniejący portfel",
  ro: "Importați un portofel existent",
  nl: "Importeer een bestaande portemonnee",
  el: "Εισαγάγετε ένα υπάρχον πορτοφόλι",
  th: "นำเข้ากระเป๋าเงินที่มีอยู่",
  cs: "Importovat existující peněženku",
  hu: "Importáljon egy meglévő pénztárcát",
  sv: "Importera en befintlig plånbok",
  da: "Importer en eksisterende pung",
}

export const UseAnotherWallet: Localized<string> = {
  en: "Use another wallet",
  zh: "使用其他钱包",
  hi: "एक और बटुआ का उपयोग करें",
  es: "Usa otra billetera",
  ar: "استخدم محفظة أخرى",
  fr: "Utiliser un autre portefeuille",
  de: "Eine andere Brieftasche verwenden",
  ru: "Используйте другой кошелек",
  pt: "Use outra carteira",
  ja: "別の財布を使う",
  pa: "ਹੋਰ ਬਟੂਏ ਦੀ ਵਰਤੋਂ ਕਰੋ",
  bn: "আরেকটি ওয়ালেট ব্যবহার করুন",
  id: "Gunakan dompet lain",
  ur: "ایک اور بٹوہ استعمال کریں",
  ms: "Gunakan dompet lain",
  it: "Usa un altro portafoglio",
  tr: "Başka bir cüzdan kullanın",
  ta: "மற்றொரு பணப்பையைப் பயன்படுத்தவும்",
  te: "ఇంకో వాలెట్ ఉపయోగించండి",
  ko: "다른 지갑 사용",
  vi: "Sử dụng ví khác",
  pl: "Użyj innego portfela",
  ro: "Folosește un alt portofel",
  nl: "Gebruik een andere portemonnee",
  el: "Χρησιμοποιήστε ένα άλλο πορτοφόλι",
  th: "ใช้กระเป๋าเงินอื่น",
  cs: "Použijte jinou peněženku",
  hu: "Használjon egy másik pénztárcát",
  sv: "Använd en annan plånbok",
  da: "Brug en anden pung",
}

export const Connection: Localized<string> = {
  en: "Connection",
  zh: "连接",
  hi: "कनेक्शन",
  es: "Conexión",
  ar: "اتصال",
  fr: "Connexion",
  de: "Verbindung",
  ru: "Соединение",
  pt: "Conexão",
  ja: "接続",
  pa: "ਕਨੈਕਸ਼ਨ",
  bn: "সংযোগ",
  id: "Koneksi",
  ur: "کنکشن",
  ms: "Sambungan",
  it: "Connessione",
  tr: "Bağlantı",
  ta: "இணைப்பு",
  te: "కనెక్షన్",
  ko: "연결",
  vi: "Kết nối",
  pl: "Połączenie",
  ro: "Conexiune",
  nl: "Verbinding",
  el: "Σύνδεση",
  th: "การเชื่อมต่อ",
  cs: "Připojení",
  hu: "Kapcsolat",
  sv: "Anslutning",
  da: "Forbindelse",
}