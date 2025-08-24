import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "~/requests";
import Section from "~/components/Section";

import { Helmet } from "react-helmet"

interface PageData {
    title: string;
    content: string;
}

export default () => {
    const { id } = useParams<{ id: string }>();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await get<PageData>(`/announcement/${id}`);
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
    }, [id]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;
    if (!page) return <p>Sayfa bulunamadı.</p>;

    return (
        <Section>
            <Helmet>
                <title>{page.title} | Kıbrıs Türk Kültür Derneği</title>
            </Helmet>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{page.title}</h1>
            <div
                className="content w-full flex flex-col gap-4"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </Section>
    );
};
