import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "~/requests";
import Section from "~/components/Section";
import { Helmet } from "react-helmet";
import News from "~/components/News";

type Post = {
    id: number;
    header: string;
    content: string;
    category: { id: number; name: string };
    cover?: string;
};

export default () => {
    const { page } = useParams<{ page: string }>();
    const [bookPosts, setBookPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                // bookData direkt Post[] döndürüyor
                const bookData = await get<Post[]>("/news");
                setBookPosts(bookData || []); // ✅ Artık doğru

                console.log(bookData);

            } catch (err: any) {
                console.error(err);
                setBookPosts([]);
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
                {bookPosts.map((post) =>
                    // @ts-ignore
                    post && <News key={post.id} {...post} />
                )}
            </div>
        </Section>
    );
};
