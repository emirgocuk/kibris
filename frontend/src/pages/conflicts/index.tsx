import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "~/requests";
import Section from "~/components/Section";
import { Helmet } from "react-helmet";
import Conflict from "~/components/Conflict";

type Post = {
    id: number;
    title: string;
    content: string;
    category: { id: number; name: string };
    cover?: string;
};

export default () => {
    const { page } = useParams<{ page: string }>();
    const [conflictPosts, setConflictPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const conflictData = await get<Post[]>("/conflict");
                setConflictPosts(conflictData || []); // <-- Doğru, çünkü veri direkt Post[]
            } catch (err: any) {
                console.error(err);
                setConflictPosts([]);
            }
        };

        fetchPage();
    }, [page]);

    return (
        <Section>
            <Helmet>
                <title>Yayınlarımız | Kıbrıs Türk Kültür Derneği</title>
            </Helmet>

            <div className="flex flex-col divide-y divide-stone-300 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {conflictPosts.map((post) => (
                        <Conflict
                            key={post.id}
                            {...post}
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
};
