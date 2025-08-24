import { useEffect, useState } from "react";
import Editor from "~/components/Editor";
import { get, post, put, del } from "~/requests";
import { useParams, useNavigate } from "react-router-dom";

interface Conflict {
    id: string;
    slug: string;
    title: string;
    content: string;
    isApproved: boolean; // Added isApproved property
}

export default function PageForm() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pages, setPages] = useState<Conflict[]>([]);

    // Sayfaları listele
    const fetchPages = async () => {
        try {
            const res: Conflict[] = await get<Conflict[]>("/conflict?panel=true");
            setPages(res || []);
        } catch (err) {
            console.error(err);
            alert("Sayfalar yüklenemedi!");
        }
    };

    // Eğer slug varsa, düzenlenecek sayfayı getir
    const fetchPage = async () => {
        if (!slug) return;
        try {
            const res: Conflict = await get<Conflict>(`/conflict/${slug}`);
            if (res) {
                setTitle(res.title);
                setContent(res.content);
            }
        } catch (err) {
            console.error(err);
            alert("Kıbrıs Uyuşmazlığı yüklenemedi!");
        }
    };

    useEffect(() => {
        fetchPages();
        fetchPage();
    }, [slug]);

    // Temizleme fonksiyonu
    const handleClear = () => {
        setTitle("");
        setContent("");
        navigate("/girne/panel/uyusmazlik/");
    };

    // Yeni ekleme / güncelleme
    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Kıbrıs Uyuşmazlığı başlığı veya içerik boş olamaz!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Giriş yapılmamış!");
            return;
        }

        try {
            const data = { title, content };

            if (slug) {
                await put(`/conflict/${slug}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Kıbrıs Uyuşmazlığı başarıyla güncellendi!");
            } else {
                await post("/conflict/", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Kıbrıs Uyuşmazlığı başarıyla oluşturuldu!");
            }

            handleClear();
            fetchPages();
        } catch (err) {
            console.error(err);
            alert("İşlem sırasında bir hata oluştu!");
        }
    };

    // Düzenleme başlat
    const handleEdit = (conflict: Conflict) => {
        navigate(`/girne/panel/uyusmazlik/${conflict.slug}`);
    };

    // Silme
    const handleDelete = async (id: string) => {
        if (!confirm("Bu sayfayı silmek istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token yok");

            await del(`/conflict/${id}`, { Authorization: `Bearer ${token}` });
            alert("Kıbrıs Uyuşmazlığı silindi!");
            fetchPages();
        } catch (err) {
            console.error(err);
            alert("Kıbrıs Uyuşmazlığı silinemedi!");
        }
    };

    // Onaylama
    const handleApprove = async (id: string) => {
        if (!confirm("Bu Kıbrıs Uyuşmazlığı paylaşımını onaylamak istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token yok");

            await put(`/conflict/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Kıbrıs Uyuşmazlığı paylaşımı onaylandı!");
            fetchPages();
        } catch (err) {
            console.error(err);
            alert("Kıbrıs Uyuşmazlığı paylaşımı onaylanamadı!");
        }
    };

    return (
        <>
            <span className="text-2xl font-bold mb-2">
                {slug ? "Kıbrıs Uyuşmazlığı Düzenle" : "Yeni Kıbrıs Uyuşmazlığı"}
            </span>

            {/* Başlık */}
            <span>Başlık</span>
            <input
                type="text"
                placeholder="Kıbrıs Uyuşmazlığı Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-400 p-2 rounded w-full"
            />

            {/* İçerik */}
            <span>İçerik</span>
            <Editor setContent={setContent} content={content} shareImage={true} />

            {/* Butonlar */}
            <div className="flex w-full justify-end gap-2 mt-3">
                <button onClick={handleClear} className="bg-gray-300 px-4 py-2 rounded">
                    Temizle
                </button>
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {slug ? "Güncelle" : "Gönder"}
                </button>
            </div>

            {/* Mevcut Sayfalar */}
            <span className="text-2xl font-bold mt-6 block">Mevcut Kıbrıs Uyuşmazlığı Paylaşımları</span>

            <ul className="divide-y divide-stone-400">
                {pages.map((conflict) => (
                    <li key={conflict.slug} className="flex justify-between items-center py-2">
                        <span>{conflict.title}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(conflict)}
                                className="bg-yellow-400 px-3 py-1 rounded"
                            >
                                Düzenle
                            </button>
                            <button
                                onClick={() => handleDelete(conflict.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Sil
                            </button>
                            {!conflict.isApproved && (
                                <button
                                    onClick={() => handleApprove(conflict.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Onayla
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
