import { cookies } from "next/headers";
import { dictionaries, LanguageCode } from "./dictionaries";

export function getDictionary(lang: LanguageCode) {
  return dictionaries[lang] ?? dictionaries.en;
}

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const lang =
    (cookieStore.get("serbapremium-lang")?.value as LanguageCode) ||
    (cookieStore.get("tokono-lang")?.value as LanguageCode) ||
    "en";
  return {
    lang: (dictionaries[lang] ? lang : "en") as LanguageCode,
    t: dictionaries[lang] ?? dictionaries.en,
  };
}
