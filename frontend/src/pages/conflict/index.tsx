import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "~/requests";
import Section from "~/components/Section";

interface PageData {
    title: string;
    content: string;
}

export default () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sayfa verisini çekiyoruz
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await get<PageData>(`/conflict/${slug}`);
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

    // Başlığı manuel olarak değiştiriyoruz
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{page.title}</h1>
            <div
                className="content w-full flex flex-col gap-4"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </Section>
    );
};
