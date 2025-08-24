import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Post = {
    id: number;
    title: string;
    content: string;
    cover?: string;
    category: { id: number; name: string };
    author?: string;
    slug?: string; // Opsiyonel, API'den gelmezse id kullanacağız
};

export default function Book({ post }: { post: Post }) {
    const [coverUrl, setCoverUrl] = useState<string | null>(post.cover || null);

    useEffect(() => {
        const checkCover = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gallery/cover/book/${post.id}`);
                if (!res.ok) throw new Error("Kapak yok veya hata");

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("image")) {
                    const blob = await res.blob();
                    setCoverUrl(URL.createObjectURL(blob));
                } else {
                    setCoverUrl(null);
                }
            } catch (err) {
                console.error(err);
                setCoverUrl(post.cover || null); // fallback
            }
        };

        checkCover();
    }, [post.id, post.cover]);

    const slug = post.slug || String(post.id); // fallback slug

    return (
        <Link
            to={`/kitap/${slug}`}
            className="flex-1 flex flex-col items-center gap-3 p-4 transition-all cursor-pointer"
        >
            <div className="aspect-[2/3] w-2/3 overflow-hidden rounded-md shadow-lg">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-stone-200 text-stone-500">
                        Kapak yok
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center text-center gap-1">
                <span className="font-bold text-sm text-gray-800">{post.title}</span>
                <span className="text-xs text-gray-500">{post.author || "Yazar bilgisi yok"}</span>
            </div>
        </Link>
    );
}
