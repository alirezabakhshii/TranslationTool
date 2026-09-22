import { useMemo, useState } from "react";
import LanguageSelector from "../../Components/LanguageSelector/LanguageSelector";
import { useTranslation } from "../../Context/TranslationContext";

export default function PublicView() {
  const { data } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(
    data.languages[0] ?? "",
  );

  const activeLanguage = data.languages.includes(selectedLanguage)
    ? selectedLanguage
    : (data.languages[0] ?? "");

  const translatedKeywords = useMemo(() => {
    return data.keywords.map((keyword) => ({
      ...keyword,
      translation: keyword.translations[activeLanguage] ?? "",
    }));
  }, [data.keywords, activeLanguage]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Translation Preview
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Public View
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Browse available translations by language.
              </p>
            </div>

            <LanguageSelector
              languages={data.languages}
              value={activeLanguage}
              onChange={setSelectedLanguage}
            />
          </div>
        </header>

        {/* Content */}
        {translatedKeywords.length === 0 ? (
          <EmptyPublicState />
        ) : (
          <section
            aria-label={`Translations in ${activeLanguage}`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Desktop */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[220px_1fr] border-b border-slate-200 bg-slate-50 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Keyword
                </span>

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Translation
                </span>
              </div>

              <div>
                {translatedKeywords.map(({ id, translation }) => (
                  <PublicTranslationRow
                    key={id}
                    keyword={id}
                    translation={translation}
                  />
                ))}
              </div>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {translatedKeywords.map(({ id, translation }) => (
                <div key={id} className="px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {id}
                  </p>

                  {translation.trim() ? (
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {translation}
                    </p>
                  ) : (
                    <MissingTranslation />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/* =====================================================
   Desktop Translation Row
===================================================== */

interface PublicTranslationRowProps {
  keyword: string;
  translation: string;
}

function PublicTranslationRow({
  keyword,
  translation,
}: PublicTranslationRowProps) {
  const hasTranslation = translation.trim().length > 0;

  return (
    <div className="grid grid-cols-[220px_1fr] border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div className="pr-6">
        <span className="text-sm font-medium text-slate-900">{keyword}</span>
      </div>

      <div>
        {hasTranslation ? (
          <span className="text-sm leading-6 text-slate-700">
            {translation}
          </span>
        ) : (
          <MissingTranslation />
        )}
      </div>
    </div>
  );
}

/* =====================================================
   Missing Translation
===================================================== */

function MissingTranslation() {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-400">
      No translation available
    </span>
  );
}

/* =====================================================
   Empty State
===================================================== */

function EmptyPublicState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <span aria-hidden="true" className="text-xl text-slate-400">
          —
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No translations available
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        There are currently no keywords available to display.
      </p>
    </div>
  );
}
