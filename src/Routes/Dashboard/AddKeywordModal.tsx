import { useEffect, useRef, useState } from "react";

import { useTranslation } from "../../Context/TranslationContext";

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddKeywordModal({
  isOpen,
  onClose,
}: AddKeywordModalProps) {
  const { data, addKeyword } = useTranslation();

  const [keyword, setKeyword] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [keywordError, setKeywordError] = useState("");

  const keywordInputRef = useRef<HTMLInputElement>(null);

  /*
   * Reset translations whenever languages change.
   */
  useEffect(() => {
    setTranslations((current) => {
      const next: Record<string, string> = {};

      data.languages.forEach((language) => {
        next[language] = current[language] ?? "";
      });

      return next;
    });
  }, [data.languages]);

  /*
   * Focus keyword input when modal opens.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      keywordInputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen]);

  /*
   * Escape closes modal.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  /*
   * Don't render when closed.
   */
  if (!isOpen) {
    return null;
  }

  function handleTranslationChange(language: string, value: string) {
    setTranslations((current) => ({
      ...current,
      [language]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setKeywordError("Please enter a keyword.");
      keywordInputRef.current?.focus();
      return;
    }

    const normalizedKeyword = trimmedKeyword.toLowerCase();

    const keywordExists = data.keywords.some(
      (item) => item.id.toLowerCase() === normalizedKeyword,
    );

    if (keywordExists) {
      setKeywordError("This keyword already exists.");
      keywordInputRef.current?.focus();
      return;
    }

    const normalizedTranslations: Record<string, string> = {};

    data.languages.forEach((language) => {
      normalizedTranslations[language] = translations[language]?.trim() ?? "";
    });

    addKeyword(trimmedKeyword, normalizedTranslations);

    setKeyword("");
    setTranslations({});
    setKeywordError("");

    onClose();
  }

  return (
    <div
      role="presentation"
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/40
        p-4
        backdrop-blur-[2px]
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-keyword-title"
        aria-describedby="add-keyword-description"
        className="
          w-full
          max-w-lg
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="add-keyword-title"
              className="text-lg font-semibold text-slate-900"
            >
              Add Keyword
            </h2>

            <p
              id="add-keyword-description"
              className="mt-1 text-sm text-slate-500"
            >
              Add a keyword and optionally provide its translations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-slate-300
            "
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Keyword
              </label>

              <input
                ref={keywordInputRef}
                id="keyword"
                name="keyword"
                type="text"
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);

                  if (keywordError) {
                    setKeywordError("");
                  }
                }}
                autoComplete="off"
                aria-invalid={Boolean(keywordError)}
                aria-describedby={keywordError ? "keyword-error" : undefined}
                placeholder="e.g. dashboard"
                className={`
                  w-full
                  rounded-lg
                  border
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  ${
                    keywordError
                      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  }
                `}
              />

              {keywordError && (
                <p
                  id="keyword-error"
                  role="alert"
                  className="mt-1.5 text-sm text-red-500"
                >
                  {keywordError}
                </p>
              )}
            </div>

            {/* Translations */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700">
                  Translations
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Leave a language empty if a translation is not available yet.
                </p>
              </div>

              {data.languages.map((language) => (
                <div key={language}>
                  <label
                    htmlFor={`translation-${language}`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {language}
                  </label>

                  <input
                    id={`translation-${language}`}
                    name={`translation-${language}`}
                    type="text"
                    value={translations[language] ?? ""}
                    onChange={(event) =>
                      handleTranslationChange(language, event.target.value)
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      px-3
                      py-2.5
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-slate-500
                      focus:ring-2
                      focus:ring-slate-200
                    "
                    placeholder={`Enter ${language} translation`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                focus:outline-none
                focus:ring-2
                focus:ring-slate-300
                sm:w-auto
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                w-full
                rounded-lg
                bg-slate-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-slate-800
                focus:outline-none
                focus:ring-2
                focus:ring-slate-400
                focus:ring-offset-2
                sm:w-auto
              "
            >
              Add Keyword
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
