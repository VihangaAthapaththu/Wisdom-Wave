import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms";

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-xs"
      onClick={onClick}
      title={title}
      className={cn("rounded-lg", active && "bg-gray-200 text-text-strong")}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({ content = "", onChange, readOnly = false, className }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing your blog post here…" }),
      CharacterCount,
      Image,
      Link.configure({ openOnClick: false, rel: "noopener noreferrer" }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const iconSize = 14;

  return (
    <div className={cn("border border-border rounded-xl overflow-hidden bg-white", className)}>
      {!readOnly && (
        <div className="flex flex-wrap gap-0.5 p-2 border-b border-border bg-surface/50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code"
          >
            <Code size={iconSize} />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1 self-center" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={iconSize} />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1 self-center" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <List size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered list"
          >
            <ListOrdered size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={false}
            title="Horizontal rule"
          >
            <Minus size={iconSize} />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1 self-center" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            active={false}
            title="Undo"
          >
            <Undo size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            active={false}
            title="Redo"
          >
            <Redo size={iconSize} />
          </ToolbarButton>
        </div>
      )}

      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm max-w-none p-4 min-h-[240px] focus-within:outline-none",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
          "[&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:mb-2",
          "[&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1",
          "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted",
          "[&_.ProseMirror_code]:bg-surface [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm",
          "[&_.ProseMirror_pre]:bg-surface [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:overflow-x-auto",
          "[&_.ProseMirror_em]:italic [&_.ProseMirror_strong]:font-bold",
          "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5",
          "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5",
          "[&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-4",
          "[&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg"
        )}
      />

      {!readOnly && (
        <div className="flex justify-end px-3 py-1.5 border-t border-border bg-surface/30 text-xs text-muted">
          <span>
            {editor.storage.characterCount.words()} words ·{" "}
            {editor.storage.characterCount.characters()} chars
          </span>
        </div>
      )}
    </div>
  );
}
