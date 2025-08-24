import { useEffect, useState } from "react";
import Editor from "~/components/Editor";
import { get, post, put, del } from "~/requests";
import { useParams, useNavigate } from "react-router-dom";
import Checkbox from "~/components/Checkbox";

interface Announcement {
    id: number;
    title: string;
    content: string;
    forAdmins?: boolean;
}

export default function AnnouncementsForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [adminOnly, setAdminOnly] = useState(false);
    const [publicAnnouncements, setPublicAnnouncements] = useState<Announcement[]>([]);
    const [adminAnnouncements, setAdminAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);

    // Token alma yardımcı fonksiyonu
    const getToken = () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Giriş yapılmamış!");
        return token;
    };

    // Duyuruları getir (admin ve genel ayrı)
    const fetchAnnouncements = async () => {
        try {
            const [publicRes, adminRes] = await Promise.all([
                get<Announcement[]>("/announcement/"),
                get<Announcement[]>("/announcement?forAdmins=true")
            ]);

            if (Array.isArray(publicRes)) {
                setPublicAnnouncements(publicRes.filter(a => !a.forAdmins));
            }
            if (Array.isArray(adminRes)) {
                setAdminAnnouncements(adminRes.filter(a => a.forAdmins));
            }
        } catch (err) {
            console.error(err);
            alert("Duyurular yüklenemedi!");
        }
    };

    // Belirli bir duyuruyu getir (düzenleme için)
    const fetchAnnouncement = async () => {
        if (!id) return;
        try {
            const res: Announcement = await get<Announcement>(`/announcement/${id}`);
            if (res) {
                setTitle(res.title);
                setContent(res.content);
                setAdminOnly(!!res.forAdmins);
            }
        } catch (err) {
            console.error(err);
            alert("Duyuru yüklenemedi!");
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        fetchAnnouncement();
    }, [id]);

    // Formu temizle
    const handleClear = () => {
        setTitle("");
        setContent("");
        setAdminOnly(false);
        navigate("/girne/panel/duyuru");
    };

    // Duyuru gönder / güncelle
    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Başlık veya içerik boş olamaz!");
            return;
        }

        let token: string;
        try {
            token = getToken();
        } catch (err: any) {
            alert(err.message);
            return;
        }

        const data = {
            title,
            content,
            forAdmins: adminOnly,
        };

        setLoading(true);
        try {
            if (id) {
                await put(`/announcement/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Duyuru güncellendi!");
            } else {
                await post("/announcement/", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Duyuru oluşturuldu!");
            }

            handleClear();
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            alert("İşlem sırasında bir hata oluştu!");
        } finally {
            setLoading(false);
        }
    };

    // Duyuru düzenleme
    const handleEdit = (announcement: Announcement) => {
        navigate(`/girne/panel/duyuru/${announcement.id}`);
    };

    // Duyuru silme
    const handleDelete = async (id: number) => {
        if (!confirm("Bu duyuruyu silmek istediğine emin misin?")) return;

        let token: string;
        try {
            token = getToken();
        } catch (err: any) {
            alert(err.message);
            return;
        }

        setLoading(true);
        try {
            await del(`/announcement/${id}`, {
                Authorization: `Bearer ${token}`,
            });
            alert("Duyuru silindi!");
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            alert("Duyuru silinemedi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <span className="text-2xl font-bold mb-2">
                {id ? "Duyuru Düzenle" : "Yeni Duyuru"}
            </span>

            {/* Başlık Alanı */}
            <span>Başlık</span>
            <input
                type="text"
                placeholder="Duyuru Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-400 p-2 rounded w-full"
                required
            />

            {/* İçerik Alanı */}
            <span className="mt-2">İçerik</span>
            <Editor setContent={setContent} content={content} shareImage={true} />

            <div className="flex w-full gap-2 justify-between mt-3">
                <Checkbox
                    label="Sadece Adminler İçin"
                    checked={adminOnly}
                    onChange={setAdminOnly}
                />

                <div className="flex gap-2">
                    <button
                        onClick={handleClear}
                        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        Temizle
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? "Gönderiliyor..." : id ? "Güncelle" : "Gönder"}
                    </button>
                </div>
            </div>

            {/* Genel Duyurular */}
            <span className="text-2xl font-bold mt-6 block">Genel Duyurular</span>
            <ul className="divide-y divide-stone-400 mb-6">
                {publicAnnouncements.length > 0 ? (
                    publicAnnouncements.map((a) => (
                        <li key={a.id} className="flex justify-between items-center py-2">
                            <span>{a.title}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(a)}
                                    className="bg-yellow-400 px-3 py-1 rounded disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(a.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Sil
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="py-2 text-gray-500">Genel duyuru yok</li>
                )}
            </ul>

            {/* Admin Duyuruları */}
            <span className="text-2xl font-bold mt-6 block">Admin Duyuruları</span>
            <ul className="divide-y divide-stone-400">
                {adminAnnouncements.length > 0 ? (
                    adminAnnouncements.map((a) => (
                        <li key={a.id} className="flex justify-between items-center py-2">
                            <span>{a.title}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(a)}
                                    className="bg-yellow-400 px-3 py-1 rounded disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(a.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Sil
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="py-2 text-gray-500">Admin duyurusu yok</li>
                )}
            </ul>
        </>
    );
}
