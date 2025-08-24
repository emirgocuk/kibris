import { useEffect, useState } from "react";
import Editor from "~/components/Editor";
import { get, post, put, del } from "~/requests";
import { AiFillFileImage } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

// Tip Tanımı
type News = {
    id: number;
    slug: string;
    title: string;
    content: string;
    isApproved: boolean; // Added isApproved property
};

export default function NewsForm() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState<News[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Tüm haberleri çek
    const fetchNews = async () => {
        try {
            const res: News[] = await get<News[]>("/news?panel=true");
            setPosts(res || []);
        } catch (err) {
            console.error(err);
            alert("Haberler yüklenemedi!");
        }
    };

    // Tek haber çek
    const fetchPost = async () => {
        if (!slug) return;
        try {
            const res: News = await get<News>(`/news/${slug}`);
            if (res) {
                setTitle(res.title);
                setContent(res.content);
                fetchCover(res.id); // ID üzerinden resim çek
            }
        } catch (err) {
            console.error(err);
            alert("Haber yüklenemedi!");
        }
    };

    // Kapak resmini post ID üzerinden çek
    const fetchCover = async (id: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gallery/cover/news/${id}`);
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("image")) {
                const url = URL.createObjectURL(await res.blob());
                setPreview(url);
            } else {
                setPreview(null);
            }
        } catch (err) {
            console.error(err);
            setPreview(null);
        }
    };

    useEffect(() => {
        fetchNews();
        fetchPost();
    }, [slug]);

    // Resim seçimi
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // Formu temizle
    const handleClear = () => {
        setTitle("");
        setContent("");
        setImage(null);
        setPreview(null);
        navigate("/girne/panel/haber");
    };

    // Form gönder
    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Başlık veya içerik boş olamaz!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Giriş yapılmamış!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (image) formData.append("photo", image);

            if (slug) {
                await put(`/news/${slug}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                    isFormData: true,
                });
                alert("Haber başarıyla güncellendi!");
            } else {
                await post("/news", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                    isFormData: true,
                });
                alert("Haber başarıyla oluşturuldu!");
            }

            handleClear();
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Haber gönderilemedi!");
        }
    };

    const handleEdit = (post: News) => {
        navigate(`/girne/panel/haber/${post.slug}`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu haberi silmek istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await del(`/news/${id}`, {
                Authorization: `Bearer ${token}`
            });

            alert("Haber silindi!");
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Haber silinemedi!");
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm("Bu haberi onaylamak istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token yok");

            await put(`/news/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Haber onaylandı!");
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Haber onaylanamadı!");
        }
    };

    return (
        <>
            <span className="text-2xl font-bold mb-2">
                {slug ? "Haber Düzenle" : "Yeni Haber"}
            </span>

            {/* Resim ve başlık */}
            <div className="grid grid-cols-[auto_1fr] gap-4 mt-2">
                <div className="aspect-video h-32 border-2 border-dashed border-stone-400 rounded-xl flex items-center justify-center relative overflow-hidden">
                    {preview ? (
                        <img src={preview} alt="Önizleme" className="w-full h-full object-cover" />
                    ) : (
                        <AiFillFileImage className="bg-stone-400 p-2 rounded-full text-lg box-content" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-1 justify-center">
                    <span>Başlık</span>
                    <input
                        type="text"
                        placeholder="Haber Başlık"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-400 p-2 rounded w-full"
                    />
                </div>
            </div>

            {/* İçerik */}
            <span className="mt-3">İçerik</span>
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

            {/* Mevcut Haberler */}
            <span className="text-2xl font-bold mt-6 block">Mevcut Haberler</span>
            <ul className="divide-y divide-stone-400">
                {posts.map((post) => (
                    <li key={post.slug} className="flex justify-between items-center py-2">
                        <span>{post.title}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(post)}
                                className="bg-yellow-400 px-3 py-1 rounded"
                            >
                                Düzenle
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Sil
                            </button>
                            {!post.isApproved && (
                                <button
                                    onClick={() => handleApprove(post.id)}
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
