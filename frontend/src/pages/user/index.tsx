import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Section from "~/components/Section";
import { get } from "~/requests";

type User = {
    id: number;
    name: string;
    biography: string;
};

export default () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    // Kullanıcı verisini çek
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await get<User>(`/user/${id}`);
                setUser(data);

                if (data) {
                    // Resim var mı kontrol et
                    const photoRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gallery/user/${data.id}`);
                    if (photoRes.ok && photoRes.headers.get("content-type")?.includes("image")) {
                        setPhotoUrl(photoRes.url);
                    } else {
                        setPhotoUrl(null);
                    }
                } else {
                    setPhotoUrl(null);
                }
            } catch (err) {
                console.error(err);
                setError("Kullanıcı yüklenemedi.");
                setPhotoUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);


    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>Kullanıcı bulunamadı.</p>;

    return (
        <Section>
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={user.name}
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            Resim yok
                        </div>
                    )}
                    <span className="text-lg font-semibold">{user.name}</span>
                </div>

                {user.biography && <div className="flex flex-col gap-3">
                    <h1>Biyografi</h1>
                    <div dangerouslySetInnerHTML={{ __html: user.biography }} />
                </div>}
            </div>
        </Section>
    );
};
