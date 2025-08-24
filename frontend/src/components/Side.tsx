import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "~/requests";

type Announcement = {
    id: number;
    title: string;
    content: string;
};

type User = {
    id: number;
    name: string;
};

export default () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Duyurular
                const dataAnnouncements = await get<Announcement[]>("/announcement");
                setAnnouncements(dataAnnouncements || []);

                // Yazarlar
                const dataUser = await get<{ users: User[] }>("/user?role=author");
                setUser(dataUser.users || []);
            } catch (err) {
                console.error("Veriler alınamadı:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="py-4 text-center">Yükleniyor...</div>;

    return (
        <div className="flex flex-col gap-6">

            {/* Duyurular */}
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Duyurular</h1>
                <div className="flex flex-col divide-y divide-gray-300 mt-2">
                    {announcements.map((a) => (
                        <Link to={`/duyuru/${a.id}`} key={a.id} className="flex flex-col py-1.5">
                            <span>{a.title}</span>
                        </Link>
                    ))}
                    {announcements.length === 0 && (
                        <span className="text-gray-500 py-2">Henüz duyuru yok</span>
                    )}
                </div>
            </div>

            {/* Yazarlar */}
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Köşe Yazarlarımız</h1>
                <div className="flex flex-col divide-y divide-gray-300 mt-2">
                    {user.map((a) => (
                        <Link to={`/yazar/${a.id}`} key={a.id} className="flex flex-col py-1.5">
                            <span>{a.name}</span>
                        </Link>
                    ))}
                    {user.length === 0 && (
                        <span className="text-gray-500 py-2">Henüz yazar yok</span>
                    )}
                </div>
            </div>

        </div>
    );
};
