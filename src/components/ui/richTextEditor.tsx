import * as React from "react";
import { cn } from "@/lib/utils";

export interface RichTextEditor
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  onChange?: (value: string) => void;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditor>(
  ({ className, onChange, ...props }, ref) => {
    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
      onChange?.(event.currentTarget.innerHTML);
    };

    const handleCommand = (command: string) => {
      document.execCommand(command, false, "");
    };

    return (
      <div>
        <div className="toolbar mb-4 flex gap-2 p-2 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800">
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={() => handleCommand("bold")}
          >
            <strong>B</strong>
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={() => handleCommand("italic")}
          >
            <em>I</em>
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={() => handleCommand("underline")}
          >
            <u>U</u>
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={() => handleCommand("strikeThrough")}
          >
            <s>S</s>
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={() => handleCommand("insertOrderedList")}
          >
            OL
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            onClick={() => handleCommand("insertUnorderedList")}
          >
            UL
          </button>
        </div>
        <div
          className={cn(
            "min-h-[200px] w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200",
            className
          )}
          ref={ref}
          contentEditable
          onInput={handleInput}
          {...props}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
