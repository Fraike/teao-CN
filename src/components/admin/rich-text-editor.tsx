"use client";

import { useCallback, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

const toolbarButton = "rounded-md px-2.5 py-1.5 text-[12px] font-bold text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40";
const toolbarActive = "bg-brand-500 text-white hover:bg-brand-700 hover:text-white";

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Underline,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "输入正文…" }),
    ],
    content: value || "",
    editorProps: { attributes: { class: "rich-text min-h-[320px] px-4 py-3 focus:outline-none" } },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.error || "上传失败");
        return;
      }
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
    },
    [editor]
  );

  if (!editor) return <div className="min-h-[360px] rounded-xl border border-line bg-white" />;

  const addLink = () => {
    const url = window.prompt("链接地址(https://…)");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-line-soft bg-surface px-2 py-1.5">
        <button type="button" className={`${toolbarButton} ${editor.isActive("bold") ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}>粗体</button>
        <button type="button" className={`${toolbarButton} ${editor.isActive("italic") ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}>斜体</button>
        <button type="button" className={`${toolbarButton} ${editor.isActive("underline") ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleUnderline().run()}>下划线</button>
        <span className="mx-1 h-4 w-px bg-line" />
        <button type="button" className={`${toolbarButton} ${editor.isActive("heading", { level: 2 }) ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={`${toolbarButton} ${editor.isActive("heading", { level: 3 }) ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={`${toolbarButton} ${editor.isActive("bulletList") ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>列表</button>
        <button type="button" className={`${toolbarButton} ${editor.isActive("orderedList") ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>编号</button>
        <button type="button" className={`${toolbarButton} ${editor.isActive("blockquote") ? toolbarActive : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>引用</button>
        <span className="mx-1 h-4 w-px bg-line" />
        <button type="button" className={toolbarButton} onClick={addLink}>链接</button>
        <button type="button" className={toolbarButton} onClick={() => fileRef.current?.click()}>插入图片</button>
        <span className="mx-1 h-4 w-px bg-line" />
        <button type="button" className={toolbarButton} onClick={() => editor.chain().focus().undo().run()}>撤销</button>
        <button type="button" className={toolbarButton} onClick={() => editor.chain().focus().redo().run()}>重做</button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={event => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
            event.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
