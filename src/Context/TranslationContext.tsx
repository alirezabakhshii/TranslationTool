import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  initialTranslations,
  type Translations,
} from "../Translations/initialTranslations";

const STORAGE_KEY = "translation-manager-data";

interface TranslationContextValue {
  data: Translations;

  updateTranslation: (
    keywordId: string,
    language: string,
    value: string,
  ) => void;

  addKeyword: (keywordId: string, translations: Record<string, string>) => void;

  reorderKeywords: (sourceId: string, targetId: string) => void;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined,
);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [data, setData] = useState<Translations>(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (!storedData) {
        return initialTranslations;
      }

      return JSON.parse(storedData);
    } catch {
      return initialTranslations;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function updateTranslation(
    keywordId: string,
    language: string,
    value: string,
  ) {
    setData((currentData) => ({
      ...currentData,

      keywords: currentData.keywords.map((keyword) => {
        if (keyword.id !== keywordId) {
          return keyword;
        }

        return {
          ...keyword,

          translations: {
            ...keyword.translations,
            [language]: value,
          },
        };
      }),
    }));
  }

  function addKeyword(keywordId: string, translations: Record<string, string>) {
    setData((currentData) => ({
      ...currentData,

      keywords: [
        ...currentData.keywords,
        {
          id: keywordId,
          translations,
        },
      ],
    }));
  }

  function reorderKeywords(sourceId: string, targetId: string) {
    setData((currentData) => {
      const keywords = [...currentData.keywords];

      const sourceIndex = keywords.findIndex(
        (keyword) => keyword.id === sourceId,
      );

      const targetIndex = keywords.findIndex(
        (keyword) => keyword.id === targetId,
      );

      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        return currentData;
      }

      const [movedKeyword] = keywords.splice(sourceIndex, 1);

      keywords.splice(targetIndex, 0, movedKeyword);

      return {
        ...currentData,
        keywords,
      };
    });
  }

  return (
    <TranslationContext.Provider
      value={{
        data,
        updateTranslation,
        addKeyword,
        reorderKeywords,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useTranslation must be used inside TranslationProvider");
  }

  return context;
}
