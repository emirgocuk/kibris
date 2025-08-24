// src/pages/home/index.tsx
import { useEffect, useState } from "react";
import News from "~/components/News";
import Conflict from "~/components/Conflict";
import Book from "~/components/Book";
import Side from "~/components/Side";
import { get } from "~/requests";
import Section from "~/components/Section";

type Post = {
    id: number;
    header: string;
    content: string;
    category: { id: number; name: string };
    cover?: string;
};

export default () => {
    const [newsPosts, setNewsPosts] = useState<Post[]>([]);
    const [conflictPosts, setConflictPosts] = useState<Post[]>([]);
    const [bookPosts, setBookPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // @ts-ignore
                const newsData = await get<{ posts: Post[] }>("/news?limit=3");
                // @ts-ignore
                setNewsPosts(newsData || []);

                // @ts-ignore
                const bookData = await get<{ posts: Post[] }>("/books?limit=3");
                // @ts-ignore
                setBookPosts(bookData || []);

                // @ts-ignore
                const conflictData = await get<{ posts: Post[] }>("/conflict?limit=6");
                // @ts-ignore
                setConflictPosts(conflictData || []);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        document.title = "Ana Sayfa | Kıbrıs Türk Kültür Derneği";

        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col gap-12">

            {/* Haberler */}
            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Haberler</h1>
                        <div className="flex flex-col divide-y divide-gray-300">
                            {newsPosts.map((post) => (
                                // @ts-ignore
                                <News key={post.id} {...post} />
                            ))}
                        </div>
                    </div>
                    <Side />
                </div>
            </Section>

            {/* Kıbrıs Uyuşmazlığı */}
            <Section>
                <h1 className="text-2xl font-bold mb-4">Kıbrıs Uyuşmazlığı</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {conflictPosts.map((post) => (
                        // @ts-ignore
                        <Conflict key={post.id} {...post} />
                    ))}
                </div>
            </Section>

            {/* Kitap Tanıtımı */}
            <Section>
                <h1 className="text-2xl font-bold mb-4">Kitap Tanıtımı</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {bookPosts.map((post) =>
                        // @ts-ignore
                        post && <Book key={post.id} post={post} />
                    )}
                </div>
            </Section>

        </div>
    );
};
