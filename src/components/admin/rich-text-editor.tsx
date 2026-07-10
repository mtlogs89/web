"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Button = ({ icon: Icon, onClick, active, title, children }: any) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition ${
      active
        ? "bg-brand-500 text-white"
        : "bg-slate-100 hover:bg-slate-200 text-ink"
    }`}
  >
    {Icon ? <Icon className="h-4 w-4" /> : children}
  </button>
);

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        alert("Upload ảnh thất bại");
        console.error(err);
      }
    };
    input.click();
  };

  const handleLinkAdd = () => {
    const url = prompt("Nhập URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <Button
          icon={Undo}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        />
        <Button
          icon={Redo}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Shift+Z)"
        />

        <div className="w-px bg-slate-300" />

        {/* Format */}
        <Button
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        />
        <Button
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        />

        <div className="w-px bg-slate-300" />

        {/* Heading */}
        <Button
          icon={Heading2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        />
        <Button
          icon={Heading3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        />

        <div className="w-px bg-slate-300" />

        {/* Lists */}
        <Button
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        />
        <Button
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        />

        <div className="w-px bg-slate-300" />

        {/* Align */}
        <Button
          icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        />
        <Button
          icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        />
        <Button
          icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        />

        <div className="w-px bg-slate-300" />

        {/* Quote & Code */}
        <Button
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        />
        <Button
          icon={Code}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        />

        <div className="w-px bg-slate-300" />

        {/* Image & Link */}
        <Button
          icon={ImageIcon}
          onClick={handleImageUpload}
          title="Insert Image"
        />
        <Button
          icon={LinkIcon}
          onClick={handleLinkAdd}
          active={editor.isActive("link")}
          title="Add Link"
        />
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-96 focus:outline-none"
      />
    </div>
  );
}
