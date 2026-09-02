import { cookies } from "next/headers";
import { dictionaries, LanguageCode } from "./dictionaries";

export function getDictionary(lang: LanguageCode) {
  return dictionaries[lang] ?? dictionaries.id;
}

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const lang =
    (cookieStore.get("serbapremium-lang")?.value as LanguageCode) ||
    (cookieStore.get("tokono-lang")?.value as LanguageCode) ||
    "id";
  return {
    lang: (dictionaries[lang] ? lang : "id") as LanguageCode,
    t: dictionaries[lang] ?? dictionaries.id,
  };
}
