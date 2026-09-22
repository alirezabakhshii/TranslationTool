import type { CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { TranslationKeyword } from "../../Translations/initialTranslations";
import DragHandleIcon from "../../Components/DragHandleIcon/DragHandleIcon";

interface SortableMobileCardProps {
  keyword: TranslationKeyword;
  languages: string[];
  onDelete: (keywordId: string) => void;
  onTranslationChange: (
    keywordId: string,
    language: string,
    value: string,
  ) => void;
}

export default function SortableMobileCard({
  keyword,
  languages,
  onTranslationChange,
  onDelete,
}: SortableMobileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: keyword.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${
        isDragging ? "relative z-20 scale-[1.01] opacity-70 shadow-lg" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${keyword.id}`}
          className="
            flex
            h-9
            w-9
            shrink-0
            cursor-grab
            touch-none
            select-none
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-slate-200
            hover:text-slate-700
            active:cursor-grabbing
          "
        >
          <DragHandleIcon />
        </button>

        <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
          {keyword.id}
        </span>

        <button
          type="button"
          onClick={() => onDelete(keyword.id)}
          aria-label={`Delete ${keyword.id}`}
          className="
    flex
    h-9
    w-9
    shrink-0
    items-center
    justify-center
    rounded-lg
    text-slate-400
    transition
    hover:bg-red-50
    hover:text-red-600
    focus:outline-none
    focus:ring-2
    focus:ring-red-200
  "
        >
          <TrashIcon />
        </button>
      </div>

      {/* Translations */}
      <div className="divide-y divide-slate-100">
        {languages.map((language) => (
          <div key={language} className="px-4 py-3">
            <label
              htmlFor={`${keyword.id}-${language}`}
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              {language}
            </label>

            <input
              id={`${keyword.id}-${language}`}
              type="text"
              value={keyword.translations[language] ?? ""}
              onChange={(event) =>
                onTranslationChange(keyword.id, language, event.target.value)
              }
              placeholder="No translation"
              className="
                block
                w-full
                border-0
                bg-transparent
                px-0
                py-1
                text-sm
                text-slate-700
                outline-none
                placeholder:text-slate-400
                focus:ring-0
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}
