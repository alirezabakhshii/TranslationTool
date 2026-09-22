import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TranslationKeyword } from "../../Translations/initialTranslations";
import DragHandleIcon from "../../Components/DragHandleIcon/DragHandleIcon";

interface SortableTableRowProps {
  keyword: TranslationKeyword;
  languages: string[];
  onDelete: (keywordId: string) => void;
  onTranslationChange: (
    keywordId: string,
    language: string,
    value: string,
  ) => void;
}

export default function SortableTableRow({
  keyword,
  languages,
  onTranslationChange,
  onDelete,
}: SortableTableRowProps) {
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
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-100 transition last:border-b-0 ${
        isDragging
          ? "relative z-10 bg-slate-50 opacity-60 shadow-sm"
          : "hover:bg-slate-50"
      }`}
    >
      <td className="w-[180px] px-5 py-3 text-left align-middle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Reorder ${keyword.id}`}
            className="cursor-grab touch-none text-slate-400 transition hover:text-slate-600 active:cursor-grabbing"
          >
            <DragHandleIcon />
          </button>

          <span className="font-medium text-slate-900">{keyword.id}</span>

          <button
            type="button"
            onClick={() => onDelete(keyword.id)}
            aria-label={`Delete ${keyword.id}`}
            className="
      flex
      h-8
      w-8
      shrink-0
      items-center
      justify-center
      rounded-md
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
      </td>

      {languages.map((language) => (
        <td key={language} className="px-5 py-3 text-left align-middle">
          <input
            type="text"
            value={keyword.translations[language] ?? ""}
            onChange={(event) =>
              onTranslationChange(keyword.id, language, event.target.value)
            }
            placeholder="No translation"
            className="block w-full border-0 bg-transparent px-0 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </td>
      ))}
    </tr>
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
