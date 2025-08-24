import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Section from "~/components/Section";
import { get } from "~/requests";

interface PageData {
    id: number;
    title: string;
    content: string;
    author: string
}

export default () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    // Sayfayı çek
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await get<PageData>(`/books/${slug}`);
                setPage(data);
                console.log(data);

            } catch (err: any) {
                console.error(err);
                setError("Sayfa yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    // Kapak fotoğrafını kontrol et
    useEffect(() => {
        const checkCover = async () => {
            if (!page) return;
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/gallery/cover/book/${page.id}`
                );
                const contentType = res.headers.get("content-type");

                if (contentType && contentType.includes("image")) {
                    setCoverUrl(res.url);
                } else {
                    setCoverUrl(null);
                }
            } catch (err) {
                console.error(err);
                setCoverUrl(null);
            }
        };

        checkCover();
    }, [page]);

    // Başlığı ve meta tag'leri güncelle
    useEffect(() => {
        if (page) {
            document.title = `${page.title} | Kıbrıs Türk Kültür Derneği`;

            // Meta description ekle/güncelle
            let metaDesc = document.querySelector("meta[name='description']");
            if (!metaDesc) {
                metaDesc = document.createElement("meta");
                metaDesc.setAttribute("name", "description");
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", page.content.slice(0, 150));

            // Open Graph title ekle/güncelle (Facebook, WhatsApp vb. için)
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (!ogTitle) {
                ogTitle = document.createElement("meta");
                ogTitle.setAttribute("property", "og:title");
                document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute("content", page.title);

            // Open Graph image güncelle
            let ogImage = document.querySelector("meta[property='og:image']");
            if (!ogImage) {
                ogImage = document.createElement("meta");
                ogImage.setAttribute("property", "og:image");
                document.head.appendChild(ogImage);
            }
            ogImage.setAttribute("content", coverUrl || "/default-cover.jpg");
        }
    }, [page, coverUrl]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;
    if (!page) return <p>Sayfa bulunamadı. {slug}</p>;

    return (
        <Section>
            <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] lg:grid-cols-[384px_1fr] gap-6 w-full">
                <div className="flex justify-center gap-2 flex-col text-center order-1 sm:order-1">
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            className="aspect-[2/3] w-full max-w-[300px] sm:max-w-[384px] object-cover rounded"
                        />
                    ) : (
                        <div className="aspect-[2/3] w-full max-w-[300px] sm:max-w-[384px] flex items-center justify-center bg-stone-200 text-stone-500 rounded">
                            Kapak yok
                        </div>
                    )}
                    {page.author}
                </div>
                <div className="order-2 sm:order-2">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">{page.title}</h1>
                    <div
                        className="content w-full flex flex-col gap-4"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </Section>
    );
};
