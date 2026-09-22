import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableKeywordProps {
  id: string;
  children: ReactNode;
}

export default function SortableKeyword({
  id,
  children,
}: SortableKeywordProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition ${isDragging ? "relative z-10 opacity-60" : ""}`}
      {...attributes}
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        {children}
      </div>
    </div>
  );
}
