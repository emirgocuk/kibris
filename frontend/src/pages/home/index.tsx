import { useEffect, useState } from "react";
import News from "~/components/News";
import Conflict from "~/components/Conflict";
import Book from "~/components/Book";
import Side from "~/components/Side";
import { get } from "~/requests";
import Section from "~/components/Section";

type Post = {
    id: number;
    title: string;
    content: string;
    slug: string;
    author?: string;
};

export default () => {
    const [newsPosts, setNewsPosts] = useState<Post[]>([]);
    const [conflictPosts, setConflictPosts] = useState<Post[]>([]);
    const [bookPosts, setBookPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const newsData = await get<Post[]>("/news?limit=3");
                setNewsPosts(newsData || []);

                const bookData = await get<Post[]>("/books?limit=3");
                setBookPosts(bookData || []);

                const conflictData = await get<Post[]>("/conflict?limit=6");
                setConflictPosts(conflictData || []);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        document.title = "Ana Sayfa | Kıbrıs Türk Kültür Derneği";
        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col gap-16 py-8">

            {/* Haberler ve Yan Menü */}
            <Section>
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h1>Haberler</h1>
                        <div className="flex flex-col divide-y divide-gray-200">
                            {newsPosts.map((post) => (
                                <News key={post.id} {...post} />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <Side />
                    </div>
                </div>
            </Section>

            {/* Kıbrıs Uyuşmazlığı */}
            <Section>
                <div className="container mx-auto">
                    <h1>Kıbrıs Uyuşmazlığı</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {conflictPosts.map((post) => (
                            <Conflict key={post.id} {...post} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* Kitap Tanıtımı */}
            <Section>
                <div className="container mx-auto">
                    <h1>Kütüphanemizden Seçmeler</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {bookPosts.map((post) =>
                            post && <Book key={post.id} post={post} />
                        )}
                    </div>
                </div>
            </Section>

        </div>
    );
};