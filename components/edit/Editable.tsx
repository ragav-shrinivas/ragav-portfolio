"use client";

import { useEdit } from "./EditProvider";
import { cn } from "@/lib/cn";

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";

/**
 * A piece of copy that the admin can edit inline on the live site.
 *
 * Usage:
 *   <Editable id="hero.greeting" as="p" className="...">Hi, I&apos;m</Editable>
 *
 * `children` is the hard-coded default (also the SSR/no-Supabase text). When an
 * override exists it is shown instead. In edit mode (admin + toggle on) the
 * element becomes contentEditable and saves on blur.
 */
export function Editable({
  id,
  as = "span",
  className,
  style,
  children,
}: {
  id: string;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  children: string;
}) {
  const { get, editMode, isAdmin, save } = useEdit();
  const Tag = as;
  const text = get(id, children);
  const on = editMode && isAdmin;

  if (!on) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={cn(className, "editable-live")}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-edit-id={id}
      title={`Editing: ${id}`}
      onBlur={(e) => {
        const next = (e.currentTarget.textContent ?? "").replace(/\s+$/g, "");
        if (next && next !== text) save(id, next);
        else if (!next) e.currentTarget.textContent = text; // don't allow empty
      }}
      onKeyDown={(e) => {
        // Enter commits (blur) for single-line fields; Shift+Enter allows newline.
        if (e.key === "Enter" && !e.shiftKey && as !== "p" && as !== "div") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {text}
    </Tag>
  );
}
