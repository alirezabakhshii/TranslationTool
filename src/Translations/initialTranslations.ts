export interface TranslationKeyword {
  id: string;
  translations: Record<string, string>;
}

export interface Translations {
  languages: string[];
  keywords: TranslationKeyword[];
}

export const initialTranslations: Translations = {
  languages: ["en", "fa", "de", "fr"],

  keywords: [
    {
      id: "welcome",
      translations: {
        en: "Welcome",
        fa: "خوش آمدید",
        de: "Willkommen",
        fr: "askdaksdnl",
      },
    },
    {
      id: "login",
      translations: {
        en: "Login",
        fa: "ورود",
        de: "Anmelden",
        fr: "askdaksdnl",
      },
    },
    {
      id: "logout",
      translations: {
        en: "Logout",
        fa: "خروج",
        de: "Abmelden",
        fr: "askdaksdnl",
      },
    },
    {
      id: "settings",
      translations: {
        en: "Settings",
        fa: "تنظیمات",
        de: "Einstellungen",
        fr: "askdaksdnl",
      },
    },
  ],
};
