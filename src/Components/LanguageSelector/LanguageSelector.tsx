interface LanguageSelectorProps {
  languages: string[];
  value: string;
  onChange: (language: string) => void;
}

export default function LanguageSelector({
  languages,
  value,
  onChange,
}: LanguageSelectorProps) {
  if (languages.length === 0) {
    return null;
  }

  return (
    <div>
      <label
        htmlFor="language-selector"
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
      >
        Language
      </label>

      <select
        id="language-selector"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          min-w-[140px]
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          py-2.5
          text-sm
          font-medium
          text-slate-700
          outline-none
          transition
          hover:border-slate-400
          focus:border-slate-500
          focus:ring-2
          focus:ring-slate-200
        "
      >
        {languages.map((language) => (
          <option key={language} value={language}>
            {language.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
