import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type NewsProps = {
    id: number;
    title: string;
    content: string;

    slug?: string
    date?: string;
};

export default ({ id, title, content, slug }: NewsProps) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    useEffect(() => {
        const checkCover = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gallery/cover/news/${id}`);
                // Backend ya image ya da false döner
                const contentType = res.headers.get("content-type");

                if (contentType && contentType.includes("image")) {
                    setCoverUrl(res.url); // direkt resmi gösterebilirsin
                } else {
                    setCoverUrl(null); // false veya hata durumu
                }
            } catch (err) {
                console.error(err);
                setCoverUrl(null);
            }
        };

        checkCover();
    }, [id]);

    return (
        <Link to={`/haber/${slug}`} className="cursor-pointer py-2 flex gap-2 group transition-colors ">
            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt={title}
                    className="aspect-video w-3xs object-cover "
                />
            ) : (
                <div className="aspect-video w-3xs flex items-center justify-center bg-stone-200 text-stone-500">
                    Kapak yok
                </div>
            )}

            <div className="flex flex-col py-2 text-xl font-bold">
                <span className="group-hover:text-bayrak ">{title}</span>
                <div
                    className="text-base text-stone-500 group-hover:text-stone-950 leading-5 font-normal line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </Link>
    );
};
