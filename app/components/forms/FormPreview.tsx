"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useResumeStore } from "@/app/store/store";
import { ResumeData } from "@/app/types/resume";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
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
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

// Safe ID generator
const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 9)}`;

type ResumeSection = keyof ResumeData;

export default function FormPreview({
  type,
  setCurrentView,
  setCurrentEntry,
  setCurrentIndex,
}: {
  type: string;
  setCurrentView: (v: string) => void;
  setCurrentEntry: (e: string) => void;
  setCurrentIndex: (i: number) => void;
}) {
  const { resume, update } = useResumeStore();
  const [open, setOpen] = useState(false);

  const defaultEntries: Record<string, Record<string, string>> = {
    education: {
      startDate: "",
      endDate: "",
      school: "",
      degree: "",
      location: "",
      description: "",
    },
    experience: {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    },
    languages: {
      language: "",
      level: "",
    },
    skills: {
      skill: "",
      level: "",
    },
  };

  // Fields to display per type
  const displayFields: Record<string, string[]> = {
    education: ["degree", "school"],
    experience: ["role", "company"],
    languages: ["language"],
    skills: ["skill", "level"],
  };

  const items: string[] = resume[type as ResumeSection] ?? [];
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // 150ms press delay before drag starts
        tolerance: 5, // pixels you can move before triggering drag
      },
    })
  );

  // Assign IDs to entries if missing
  useEffect(() => {
    if (!items || items.length === 0) return;
    const needPatch = items.some((it) => !it || typeof it.id !== "string");
    if (!needPatch) return;

    const patched = items.map((it) => {
      if (!it) return { id: newId() };
      if (typeof it.id === "string" && it.id.length > 0) return it;
      return { ...it, id: newId() };
    });

    update({ [type]: patched });
  }, [items.length, type, update]);

  const arrayMove = (array: any[], from: number, to: number) => {
    const newArray = [...array];
    const [item] = newArray.splice(from, 1);
    newArray.splice(to, 0, item);
    return newArray;
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(items, oldIndex, newIndex);
      update({ [type]: reordered });
    }
  };

  const openEntry = (entry: any, index: number) => {
    setCurrentView(type);
    setCurrentEntry(entry);
    setCurrentIndex(index);
  };

  const addEntry = (e: React.MouseEvent, typeStr: string) => {
    e.stopPropagation();
    const template = defaultEntries[typeStr];
    if (!template) return;
    const newEntry = { ...template, id: newId() };
    update({ [typeStr]: [...(resume[typeStr] || []), newEntry] });
    setCurrentView(typeStr);
    setCurrentEntry(newEntry);
    setCurrentIndex(resume[typeStr]?.length ?? 0);
  };

  return (
    <div className="rounded-2xl bg-white mt-3 shadow-md p-5">
      {/* Header */}
      <div
        className="flex flex-row justify-between items-center cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <h1 className="capitalize font-bold text-xl">{type}</h1>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown />
        </motion.div>
      </div>

      {/* Expandable section with animation */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="expandable"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {items.length === 0 ? (
              <div className="text-gray-500 italic">No entries yet</div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={items.map((it) => it.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item, idx) => (
                    <SortableItem key={item.id} id={item.id}>
                      <div
                        className="w-full flex justify-between border-[#ede9e9] border-t border-b p-3 mb-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEntry(item, idx);
                        }}
                      >
                        {(() => {
                          const keys = displayFields[type] || [];
                          const existingValues = keys
                            .map((key) => {
                              const val = item[key];
                              if (!val) return null;
                              return (
                                <div
                                  key={key}
                                  className="capitalize font-semibold mr-3 truncate"
                                >
                                  {Array.isArray(val) ? val.join(", ") : String(val)}
                                </div>
                              );
                            })
                            .filter(Boolean);

                          return existingValues.length > 0 ? (
                            existingValues
                          ) : (
                            <div>Edit Entry</div>
                          );
                        })()}
                      </div>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            )}

            <div className="flex justify-center">
              <button
                className="text-sm items-center mt-3 p-2 pl-3 pr-3 border border-gray-200 rounded-xl cursor-pointer font-bold flex flex-row"
                onClick={(e) => addEntry(e, type)}
              >
                <Plus />
                <span className="ml-2">Add Entry</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
