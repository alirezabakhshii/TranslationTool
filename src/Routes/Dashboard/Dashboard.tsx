import { useCallback, useMemo, useState } from "react";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useTranslation } from "../../Context/TranslationContext";

import AddKeywordModal from "./AddKeywordModal";
import SortableMobileCard from "./SortableMobileCard";
import SortableTableRow from "./SortableTableRow";

export default function Dashboard() {
  const { data, updateTranslation, reorderKeywords, deleteKeyword } =
    useTranslation();

  const [isAddKeywordModalOpen, setIsAddKeywordModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /*
   * Keep the IDs based on the complete dataset.
   *
   * This is important because filtering should only affect
   * what is displayed, not the underlying ordering.
   */
  const keywordIds = useMemo(
    () => data.keywords.map((keyword) => keyword.id),
    [data.keywords],
  );

  /*
   * Search keywords and translations.
   */
  const filteredKeywords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return data.keywords;
    }

    return data.keywords.filter((keyword) => {
      const matchesKeyword = keyword.id.toLowerCase().includes(query);

      const matchesTranslation = Object.values(keyword.translations).some(
        (translation) => translation.toLowerCase().includes(query),
      );

      return matchesKeyword || matchesTranslation;
    });
  }, [data.keywords, searchQuery]);

  const handleTranslationChange = useCallback(
    (keywordId: string, language: string, value: string) => {
      updateTranslation(keywordId, language, value);
    },
    [updateTranslation],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      const sourceId = String(active.id);
      const targetId = String(over.id);

      if (sourceId === targetId) {
        return;
      }

      reorderKeywords(sourceId, targetId);
    },
    [reorderKeywords],
  );

  const handleOpenAddKeywordModal = useCallback(() => {
    setIsAddKeywordModalOpen(true);
  }, []);

  const handleCloseAddKeywordModal = useCallback(() => {
    setIsAddKeywordModalOpen(false);
  }, []);

  const hasKeywords = data.keywords.length > 0;
  const hasSearch = searchQuery.trim().length > 0;
  const hasSearchResults = filteredKeywords.length > 0;

  const handleDeleteKeyword = useCallback(
    (keywordId: string) => {
      deleteKeyword(keywordId);
    },
    [deleteKeyword],
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Translation Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your keywords and translations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddKeywordModal}
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-slate-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                hover:bg-slate-800
                focus:outline-none
                focus:ring-2
                focus:ring-slate-400
                focus:ring-offset-2
                sm:w-auto
              "
            >
              <span aria-hidden="true" className="text-lg leading-none">
                +
              </span>
              Add Keyword
            </button>
          </div>
        </header>

        {!hasKeywords ? (
          <EmptyState onAddKeyword={handleOpenAddKeywordModal} />
        ) : (
          <>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <label htmlFor="keyword-search" className="sr-only">
                  Search keywords and translations
                </label>

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon />
                </div>

                <input
                  id="keyword-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search keywords or translations..."
                  className="
                    block
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    py-2.5
                    pl-10
                    pr-10
                    text-sm
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    hover:border-slate-400
                    focus:border-slate-500
                    focus:ring-2
                    focus:ring-slate-200
                  "
                />
              </div>

              {hasSearch && (
                <p className="mt-2 text-xs text-slate-500" aria-live="polite">
                  {hasSearchResults
                    ? `${filteredKeywords.length} ${
                        filteredKeywords.length === 1 ? "result" : "results"
                      } found`
                    : "No results found"}
                </p>
              )}
            </div>

            {!hasSearchResults ? (
              <SearchEmptyState
                query={searchQuery}
                onClear={() => setSearchQuery("")}
              />
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={keywordIds}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full table-fixed border-collapse">
                          <caption className="sr-only">
                            Translation keywords and their translations
                          </caption>

                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="w-[180px] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Keyword
                              </th>

                              {data.languages.map((language) => (
                                <th
                                  key={language}
                                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                                >
                                  {language}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {filteredKeywords.map((keyword) => (
                              <SortableTableRow
                                key={keyword.id}
                                onDelete={handleDeleteKeyword}
                                keyword={keyword}
                                languages={data.languages}
                                onTranslationChange={handleTranslationChange}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={keywordIds}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {filteredKeywords.map((keyword) => (
                          <SortableMobileCard
                            key={keyword.id}
                            onDelete={handleDeleteKeyword}
                            keyword={keyword}
                            languages={data.languages}
                            onTranslationChange={handleTranslationChange}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <AddKeywordModal
        isOpen={isAddKeywordModalOpen}
        onClose={handleCloseAddKeywordModal}
      />
    </main>
  );
}

/* ---------------------------------- */
/* Empty States */
/* ---------------------------------- */

interface EmptyStateProps {
  onAddKeyword: () => void;
}

function EmptyState({ onAddKeyword }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <span aria-hidden="true" className="text-xl text-slate-500">
          +
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No keywords yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Add your first keyword and start managing its translations.
      </p>

      <button
        type="button"
        onClick={onAddKeyword}
        className="
          mt-6
          inline-flex
          items-center
          justify-center
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
        "
      >
        Add Keyword
      </button>
    </div>
  );
}

interface SearchEmptyStateProps {
  query: string;
  onClear: () => void;
}

function SearchEmptyState({ query, onClear }: SearchEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <SearchIcon />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No results found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        No keyword or translation matches{" "}
        <span className="font-medium text-slate-700">"{query}"</span>.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="
          mt-6
          inline-flex
          items-center
          justify-center
          rounded-lg
          border
          border-slate-300
          bg-white
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
          focus:ring-offset-2
        "
      >
        Clear Search
      </button>
    </div>
  );
}

/* ---------------------------------- */
/* Icons */
/* ---------------------------------- */

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
