import { useEffect, useState } from "react";
import Editor from "~/components/Editor";
import { get, post, put, del } from "~/requests";
import { useParams, useNavigate } from "react-router-dom";

// Tip tanımı
type Page = {
    id: string;
    slug: string;
    title: string;
    content: string;
};

export default function PageForm() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pages, setPages] = useState<Page[]>([]);

    // Sayfaları çek
    const fetchPages = async () => {
        try {
            const res: Page[] = await get<Page[]>("/page/");
            setPages(res || []);
        } catch (err) {
            console.error(err);
            alert("Sayfalar yüklenemedi!");
        }
    };

    // Tek sayfayı çek
    const fetchPage = async () => {
        if (!slug) return;
        try {
            const res: Page = await get<Page>(`/page/${slug}`);
            if (res) {
                setTitle(res.title);
                setContent(res.content);
            }
        } catch (err) {
            console.error(err);
            alert("Sayfa yüklenemedi!");
        }
    };

    useEffect(() => {
        fetchPages();
        fetchPage();
    }, [slug]);

    // Formu temizle
    const handleClear = () => {
        setTitle("");
        setContent("");
        navigate("/girne/panel/sayfa");
    };

    // Yeni sayfa ekle veya düzenle
    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Sayfa başlığı veya içerik boş olamaz!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Giriş yapılmamış!");
            return;
        }

        try {
            if (slug) {
                await put(`/page/${slug}`, { title, content }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Sayfa başarıyla güncellendi!");
            } else {
                await post("/page/", { title, content }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Sayfa başarıyla oluşturuldu!");
            }

            handleClear();
            fetchPages();
        } catch (err) {
            console.error(err);
            alert("İşlem sırasında bir hata oluştu!");
        }
    };

    // Düzenleme
    const handleEdit = (page: Page) => {
        navigate(`/girne/panel/sayfa/${page.slug}`);
    };

    // Silme
    const handleDelete = async (id: string) => {
        if (!confirm("Bu sayfayı silmek istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await del(`/page/${id}`, {
                Authorization: `Bearer ${token}`
            });

            alert("Sayfa silindi!");
            fetchPages();
        } catch (err) {
            console.error(err);
            alert("Sayfa silinemedi!");
        }
    };

    return (
        <>
            <span className="text-2xl font-bold mb-2">
                {slug ? "Sayfa Düzenle" : "Yeni Sayfa"}
            </span>

            {/* Başlık */}
            <span>Başlık</span>
            <input
                type="text"
                placeholder="Sayfa Başlık"
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
            <span className="text-2xl font-bold mt-6 block">Mevcut Sayfalar</span>
            <ul className="divide-y divide-stone-400">
                {pages.map((page) => (
                    <li key={page.slug} className="flex justify-between items-center py-2">
                        <span>{page.title}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(page)}
                                className="bg-yellow-400 px-3 py-1 rounded"
                            >
                                Düzenle
                            </button>
                            <button
                                onClick={() => handleDelete(page.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Sil
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
