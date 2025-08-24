import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "~/requests";
import Section from "~/components/Section";

interface PageData {
    id: string;
    title: string;
    content: string;
}

export default () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    // Sayfa verisini çek
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await get<PageData>(`/news/${slug}`);
                setPage(data);
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
                    `${import.meta.env.VITE_API_ENDPOINT}/gallery/cover/news/${page.id}`
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

    // Başlığı manuel olarak değiştir
    useEffect(() => {
        if (page?.title) {
            document.title = `${page.title} | Kıbrıs Türk Kültür Derneği`;
        } else {
            document.title = "Yükleniyor... | Kıbrıs Türk Kültür Derneği";
        }
    }, [page]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;
    if (!page) return <p>Sayfa bulunamadı.</p>;

    return (
        <Section>
            {coverUrl ? (
                <img
                    src={coverUrl}
                    className="w-full max-w-4xl mx-auto aspect-video object-cover rounded-md"
                    alt={page.title}
                />
            ) : (
                <div className="w-full max-w-4xl mx-auto aspect-video flex items-center justify-center bg-stone-200 text-stone-500 rounded-md">
                    Kapak yok
                </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4 text-center sm:text-left">
                {page.title}
            </h1>
            <div
                className="content w-full flex flex-col gap-4"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </Section>
    );
};
