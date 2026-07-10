"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video as VideoIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Table as TableIcon,
  Trash2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  active,
  title,
  disabled,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex h-8 min-w-8 items-center justify-center rounded px-1.5 text-sm font-semibold transition disabled:opacity-40 ${
        active ? "bg-brand-500 text-white" : "text-ink hover:bg-slate-200"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : label}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 w-px self-stretch bg-slate-300" />;
}

function TableMenu({ editor }: { editor: Editor }) {
  const inTable = editor.isActive("table");
  return (
    <>
      <ToolBtn
        icon={TableIcon}
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        title="Chèn bảng 3×3"
      />
      {inTable && (
        <>
          <ToolBtn label="+Hàng" onClick={() => editor.chain().focus().addRowAfter().run()} title="Thêm hàng dưới" />
          <ToolBtn label="−Hàng" onClick={() => editor.chain().focus().deleteRow().run()} title="Xóa hàng" />
          <ToolBtn label="+Cột" onClick={() => editor.chain().focus().addColumnAfter().run()} title="Thêm cột phải" />
          <ToolBtn label="−Cột" onClick={() => editor.chain().focus().deleteColumn().run()} title="Xóa cột" />
          <ToolBtn icon={Trash2} onClick={() => editor.chain().focus().deleteTable().run()} title="Xóa bảng" />
        </>
      )}
    </>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink-muted">
        Đang tải trình soạn thảo…
      </div>
    );
  }

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
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        } else {
          alert(data.error || "Upload ảnh thất bại");
        }
      } catch {
        alert("Upload ảnh thất bại");
      }
    };
    input.click();
  };

  const handleLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("Nhập URL:", prev || "https://");
    if (url === null) return;
    if (url === "" || url === "https://") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleYoutube = () => {
    const url = prompt("Dán link YouTube:");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  const words = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const para = () => editor.chain().focus().setParagraph().run();
  const heading = (level: 2 | 3 | 4) =>
    editor.chain().focus().toggleHeading({ level }).run();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 p-2">
        <ToolBtn icon={Undo} onClick={() => editor.chain().focus().undo().run()} title="Hoàn tác (Ctrl+Z)" disabled={!editor.can().undo()} />
        <ToolBtn icon={Redo} onClick={() => editor.chain().focus().redo().run()} title="Làm lại (Ctrl+Shift+Z)" disabled={!editor.can().redo()} />
        <Divider />
        <ToolBtn label="P" onClick={para} active={editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList")} title="Đoạn văn thường" />
        <ToolBtn label="H2" onClick={() => heading(2)} active={editor.isActive("heading", { level: 2 })} title="Tiêu đề mục lớn (H2)" />
        <ToolBtn label="H3" onClick={() => heading(3)} active={editor.isActive("heading", { level: 3 })} title="Tiêu đề mục nhỏ (H3)" />
        <ToolBtn label="H4" onClick={() => heading(4)} active={editor.isActive("heading", { level: 4 })} title="Tiêu đề phụ (H4)" />
        <Divider />
        <ToolBtn icon={Bold} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="In đậm (Ctrl+B)" />
        <ToolBtn icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="In nghiêng (Ctrl+I)" />
        <ToolBtn icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Gạch chân (Ctrl+U)" />
        <ToolBtn icon={Strikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Gạch ngang chữ" />
        <Divider />
        <ToolBtn icon={AlignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Căn trái" />
        <ToolBtn icon={AlignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Căn giữa" />
        <ToolBtn icon={AlignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Căn phải" />
        <ToolBtn icon={AlignJustify} onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Căn đều 2 bên" />
        <Divider />
        <ToolBtn icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Danh sách chấm" />
        <ToolBtn icon={ListOrdered} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Danh sách đánh số" />
        <ToolBtn icon={Quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Trích dẫn" />
        <ToolBtn icon={Code} onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Khối code" />
        <ToolBtn icon={Minus} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang" />
        <Divider />
        <ToolBtn icon={LinkIcon} onClick={handleLink} active={editor.isActive("link")} title="Chèn/sửa link" />
        <ToolBtn icon={Unlink} onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Gỡ link" />
        <ToolBtn icon={ImageIcon} onClick={handleImageUpload} title="Chèn ảnh từ máy" />
        <ToolBtn icon={VideoIcon} onClick={handleYoutube} title="Chèn video YouTube" />
        <Divider />
        <TableMenu editor={editor} />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="rte prose-mt" />

      {/* Footer */}
      <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-xs text-ink-muted">
        {words} từ
      </div>
    </div>
  );
}
