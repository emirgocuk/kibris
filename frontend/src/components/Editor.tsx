import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import {
    AiOutlineBold,
    AiOutlineItalic,
    AiOutlineStrikethrough,
    AiOutlineUnorderedList,
    AiOutlineOrderedList,
} from "react-icons/ai";
import { MdOutlineImage } from "react-icons/md";
import Image from "@tiptap/extension-image";
import { post } from "~/requests";

type EditorProps = {
    content?: string;
    setContent: (value: string) => void;
    shareImage?: boolean
};

export default function Editor({ content = "", setContent, shareImage = false }: EditorProps) {
    const [, forceUpdate] = useState(0);

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px]",
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;
        const onSelection = () => forceUpdate((x) => x + 1);
        editor.on("selectionUpdate", onSelection);
        return () => {
            editor.off("selectionUpdate", onSelection);
        };
    }, [editor]);

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    const btn = (active: boolean) =>
        `aspect-square p-1 rounded ${active ? "bg-blue-200" : "text-gray-600 hover:bg-gray-100"}`;

    // Resim yükleme fonksiyonu
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const res = await post<{ id: number }>("/gallery/photo", formData, {
                isFormData: true,
            });

            if (res?.id) {
                // API'den sadece ID döndü → URL'yi biz oluşturuyoruz
                const imageUrl = `${import.meta.env.VITE_API_ENDPOINT}/gallery/${res.id}`;
                editor.chain().focus().setImage({ src: imageUrl }).run();
            }
        } catch (err) {
            console.error("Resim yüklenemedi:", err);
        }
    };

    return (
        <div className="border border-stone-400 rounded-lg">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b p-2 bg-gray-50 rounded-t-lg">
                <button
                    type="button"
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={btn(editor.isActive("bold"))}
                >
                    <AiOutlineBold size={18} />
                </button>

                <button
                    type="button"
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={btn(editor.isActive("italic"))}
                >
                    <AiOutlineItalic size={18} />
                </button>

                <button
                    type="button"
                    title="Strikethrough"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={btn(editor.isActive("strike"))}
                >
                    <AiOutlineStrikethrough size={18} />
                </button>

                <button
                    type="button"
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={btn(editor.isActive("bulletList"))}
                >
                    <AiOutlineUnorderedList size={18} />
                </button>

                <button
                    type="button"
                    title="Ordered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={btn(editor.isActive("orderedList"))}
                >
                    <AiOutlineOrderedList size={18} />
                </button>

                {/* Resim yükleme butonu */}
                {shareImage && <label className="cursor-pointer aspect-square p-1 rounded text-gray-600 hover:bg-gray-100">
                    <MdOutlineImage size={18} />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>

                }
            </div>

            {/* Editor */}
            <div className="p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
