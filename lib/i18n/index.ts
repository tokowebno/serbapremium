import { cookies, headers } from "next/headers";
import { dictionaries, LanguageCode } from "./dictionaries";

export function getDictionary(lang: LanguageCode) {
  return dictionaries[lang] ?? dictionaries.en;
}

export async function getServerTranslation() {
  const cookieStore = await cookies();
  let lang =
    (cookieStore.get("serbapremium-lang")?.value as LanguageCode) ||
    (cookieStore.get("tokono-lang")?.value as LanguageCode);

  if (!lang || !dictionaries[lang]) {
    try {
      const hdrs = await headers();
      const acceptLang = (hdrs.get("accept-language") || "").toLowerCase();
      if (acceptLang.startsWith("id") || acceptLang.startsWith("ms")) {
        lang = "id";
      } else if (acceptLang.startsWith("zh")) {
        lang = "zh";
      } else {
        lang = "en";
      }
    } catch {
      lang = "en";
    }
  }

  return {
    lang: (dictionaries[lang] ? lang : "en") as LanguageCode,
    t: dictionaries[lang] ?? dictionaries.en,
  };
}
