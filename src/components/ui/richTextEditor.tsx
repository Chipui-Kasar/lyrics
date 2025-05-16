"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import * as Toggle from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "icon",
    },
  }
);

interface RichTextEditorProps {
  name?: string;
  defaultValue?: string;
  onChange?: (event: { target: { name?: string; value: string } }) => void;
}

export function RichTextEditor({
  name,
  defaultValue = "",
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mount-only initialization
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasInitializedContent = useRef(false);

  useEffect(() => {
    if (editorRef.current && defaultValue === "") {
      editorRef.current.innerHTML = "";
    }
    if (editorRef.current && !hasInitializedContent.current) {
      editorRef.current.innerHTML = defaultValue || "";
      hasInitializedContent.current = true;

      // Set caret to end
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [defaultValue]);

  const emitChange = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange({
        target: {
          name,
          value: editorRef.current.innerHTML,
        },
      });
    }
  }, [onChange, name]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("input", emitChange);
      return () => editor.removeEventListener("input", emitChange);
    }
  }, [emitChange]);

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    emitChange();
  };

  const formatText = (command: string) => execCommand(command);
  const formatBlock = (blockType: string) =>
    execCommand("formatBlock", blockType);

  const isFormatActive = (format: string) => document.queryCommandState(format);

  if (!isMounted) return null;

  return (
    <div className={cn("border rounded-md")}>
      {/* Toolbar */}
      <div className="toolbar mb-4 flex gap-2 p-2 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800">
        <Toggle.Root
          className={toggleVariants()}
          pressed={isFormatActive("bold")}
          onPressedChange={() => formatText("bold")}
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </Toggle.Root>
        <div className="h-7 w-px bg-border mx-1" />
        <Toggle.Root
          className={toggleVariants()}
          pressed={isFormatActive("italic")}
          onPressedChange={() => formatText("italic")}
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </Toggle.Root>
        <div className="h-7 w-px bg-border mx-1" />
        <Toggle.Root
          className={toggleVariants()}
          pressed={isFormatActive("underline")}
          onPressedChange={() => formatText("underline")}
          aria-label="Underline"
        >
          <Underline className="w-4 h-4" />
        </Toggle.Root>
        <div className="h-7 w-px bg-border mx-1" />
        <Toggle.Root
          className={toggleVariants()}
          pressed={isFormatActive("strikeThrough")}
          onPressedChange={() => formatText("strikeThrough")}
          aria-label="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </Toggle.Root>

        <div className="h-7 w-px bg-border mx-1" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "p-4 min-h-[200px] focus:outline-none prose prose-stone dark:prose-invert max-w-none"
        )}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            execCommand("insertLineBreak");
          }
        }}
        // placeholder={placeholder}
      />
    </div>
  );
}
