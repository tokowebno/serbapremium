export interface GameAccountField {
  id: string;
  label: string;
  placeholder: string;
  example: string;
  type?: "text" | "select";
  options?: string[];
}

export interface GameConfig {
  gameKey: string;
  gameName: string;
  fields: GameAccountField[];
  guideText?: string;
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
  mlbb: {
    gameKey: "mlbb",
    gameName: "Mobile Legends: Bang Bang",
    fields: [
      {
        id: "userId",
        label: "User ID MLBB",
        placeholder: "Contoh: 12345678",
        example: "ID akun angka yang ada di profil game",
      },
      {
        id: "zoneId",
        label: "Zone ID (Server)",
        placeholder: "Contoh: 2123",
        example: "4-5 digit angka di dalam tanda kurung",
      },
    ],
    guideText: "Buka profil MLBB Anda di pojok kiri atas. Contoh format: 12345678 (2123).",
  },
  freefire: {
    gameKey: "freefire",
    gameName: "Free Fire",
    fields: [
      {
        id: "playerId",
        label: "Player ID Free Fire",
        placeholder: "Contoh: 198273645",
        example: "Salin ID karakter dari profil FF Anda",
      },
    ],
    guideText: "Buka profil Free Fire Anda di pojok kiri atas dan salin deretan angka Player ID Anda.",
  },
  roblox: {
    gameKey: "roblox",
    gameName: "Roblox",
    fields: [
      {
        id: "robloxUsername",
        label: "Username Roblox",
        placeholder: "Contoh: Player_Tino",
        example: "Username akun Roblox Anda (bukan display name)",
      },
    ],
    guideText: "Masukkan username akun Roblox Anda. Tidak memerlukan password.",
  },
  valorant: {
    gameKey: "valorant",
    gameName: "Valorant",
    fields: [
      {
        id: "riotId",
        label: "Riot ID (Nama#Tagline)",
        placeholder: "Contoh: TinoGamer#ID1",
        example: "Username Riot Games beserta tanda pagar dan tagline",
      },
    ],
    guideText: "Buka profil Riot Games / Valorant Anda. Pastikan menyertakan tanda # dan Tagline.",
  },
  pubg: {
    gameKey: "pubg",
    gameName: "PUBG Mobile",
    fields: [
      {
        id: "playerId",
        label: "Player ID PUBG",
        placeholder: "Contoh: 512345678",
        example: "Deretan angka User ID dari profil PUBG",
      },
      {
        id: "nickname",
        label: "Nickname Karakter",
        placeholder: "Contoh: TinoGamer",
        example: "Nama in-game karakter Anda",
      },
    ],
    guideText: "Buka menu profil PUBG Mobile Anda untuk melihat Player ID dan Nickname.",
  },
  genshin: {
    gameKey: "genshin",
    gameName: "Genshin Impact",
    fields: [
      {
        id: "uid",
        label: "UID Genshin Impact",
        placeholder: "Contoh: 812345678",
        example: "9 digit angka UID yang ada di pojok kanan bawah layar",
      },
      {
        id: "server",
        label: "Server Akun",
        placeholder: "Pilih Server",
        example: "Server tempat karakter Anda berada",
        type: "select",
        options: ["Asia", "America", "Europe", "TW, HK, MO"],
      },
    ],
    guideText: "Lihat angka UID 9 digit di pojok kanan bawah layar saat Anda bermain game.",
  },
};

export function getGameConfig(productNameOrSlug: string): GameConfig | null {
  if (!productNameOrSlug) return null;
  const s = productNameOrSlug.toLowerCase();
  if (s.includes("mobile legend") || s.includes("mlbb") || s.includes("diamond ml")) {
    return GAME_CONFIGS.mlbb;
  }
  if (s.includes("free fire") || s.includes("ff") || s.includes("diamond ff")) {
    return GAME_CONFIGS.freefire;
  }
  if (s.includes("roblox") || s.includes("robux")) {
    return GAME_CONFIGS.roblox;
  }
  if (s.includes("valorant") || s.includes("riot points") || s.includes("vp")) {
    return GAME_CONFIGS.valorant;
  }
  if (s.includes("pubg") || s.includes("unknown cash") || s.includes("uc")) {
    return GAME_CONFIGS.pubg;
  }
  if (s.includes("genshin") || s.includes("genesis") || s.includes("welkin")) {
    return GAME_CONFIGS.genshin;
  }
  return null;
}
