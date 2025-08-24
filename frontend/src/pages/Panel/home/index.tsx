import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { get } from "~/requests";

interface Announcement {
    id: number;
    title: string;
    content: string;
    forAdmins?: boolean;
}

export default function AnnouncementsForm() {


    const [adminAnnouncements, setAdminAnnouncements] = useState<Announcement[]>([]);


    // Duyuruları getir (admin ve genel ayrı)
    const fetchAnnouncements = async () => {
        try {
            const [adminRes] = await Promise.all([
                get<Announcement[]>("/announcement?forAdmins=true")
            ]);

            if (Array.isArray(adminRes)) {
                setAdminAnnouncements(adminRes.filter(a => a.forAdmins));
            }
        } catch (err) {
            console.error(err);
            alert("Duyurular yüklenemedi!");
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <>

            {/* Admin Duyuruları */}
            <span className="text-2xl font-bold mt-6 block">Duyurular</span>
            <ul className="divide-y divide-stone-400">
                {adminAnnouncements.length > 0 ? (
                    adminAnnouncements.map((a) => (
                        <Link to={`/duyuru/${a.id}`} key={a.id} className="flex justify-between items-center py-2">
                            {a.title}
                        </Link>
                    ))
                ) : (
                    <li className="py-2 text-gray-500">Admin duyurusu yok</li>
                )}
            </ul>
        </>
    );
}
