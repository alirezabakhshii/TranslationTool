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
  const { data, updateTranslation, reorderKeywords } = useTranslation();

  const [isAddKeywordModalOpen, setIsAddKeywordModalOpen] = useState(false);

  /*
   * DnD Sensors
   *
   * PointerSensor:
   * Desktop mouse / trackpad interaction.
   *
   * TouchSensor:
   * Mobile touch interaction.
   *
   * KeyboardSensor:
   * Accessibility + keyboard reordering.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /*
   * We only need the keyword IDs for SortableContext.
   *
   * useMemo prevents recreating the array unnecessarily
   * when unrelated state changes.
   */
  const keywordIds = useMemo(
    () => data.keywords.map((keyword) => keyword.id),
    [data.keywords],
  );

  /*
   * Translation change handler.
   *
   * Context owns the actual state mutation.
   * Dashboard only forwards the event.
   */
  const handleTranslationChange = useCallback(
    (keywordId: string, language: string, value: string) => {
      updateTranslation(keywordId, language, value);
    },
    [updateTranslation],
  );

  /*
   * Called after a successful drag.
   */
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================
            Header
        ========================== */}
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                +
              </span>
              Add Keyword
            </button>
          </div>
        </header>

        {/* =========================
            Content
        ========================== */}

        {!hasKeywords ? (
          <EmptyState onAddKeyword={handleOpenAddKeywordModal} />
        ) : (
          <>
            {/* =========================
                Desktop Table
            ========================== */}

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
                        {data.keywords.map((keyword) => (
                          <SortableTableRow
                            key={keyword.id}
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

            {/* =========================
                Mobile Cards
            ========================== */}

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
                    {data.keywords.map((keyword) => (
                      <SortableMobileCard
                        key={keyword.id}
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
      </div>

      {/* =========================
          Add Keyword Modal
      ========================== */}

      <AddKeywordModal
        isOpen={isAddKeywordModalOpen}
        onClose={handleCloseAddKeywordModal}
      />
    </main>
  );
}

/* =====================================================
   Empty State
===================================================== */

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
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        Add Keyword
      </button>
    </div>
  );
}
