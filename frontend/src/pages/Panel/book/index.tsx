import { useEffect, useState, type ChangeEvent } from "react";
import Editor from "~/components/Editor";
import { get, post, put, del } from "~/requests";
import { AiFillFileImage } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";

interface Book {
    id: number;
    title: string;
    author: string;
    content: string;
    slug: string;
    isApproved: boolean; // Added isApproved property
}

export default function PostManager() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [books, setBooks] = useState<Book[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Kitapları getir
    const fetchBooks = async () => {
        try {
            const res: Book[] = await get<Book[]>("/books?panel=true"); // Added panel=true
            setBooks(res || []);
        } catch (err) {
            console.error(err);
            alert("Kitaplar yüklenemedi!");
        }
    };

    // Düzenleme için kitap verisini al
    const fetchBook = async () => {
        if (!slug) return;
        try {
            const res: Book = await get<Book>(`/books/${slug}`);
            if (res) {
                setTitle(res.title);
                setAuthor(res.author);
                setContent(res.content);
                fetchCover(res.id); // ID üzerinden resim çek
            }
        } catch (err) {
            console.error(err);
            alert("Kitap yüklenemedi!");
        }
    };

    // Kapak resmini post/kitap ID üzerinden çek
    const fetchCover = async (id: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gallery/cover/book/${id}`);
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
        fetchBooks();
        fetchBook();
    }, [slug]);

    // Resim seçimi
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // Temizleme
    const handleClear = () => {
        setTitle("");
        setAuthor("");
        setContent("");
        setImage(null);
        setPreview(null);
        navigate("/girne/panel/kitap");
    };

    // Yeni ekleme / güncelleme
    const handleSubmit = async () => {
        if (!title.trim() || !author.trim() || !content.trim()) {
            alert("Tüm alanlar doldurulmalıdır!");
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
            formData.append("author", author);
            formData.append("content", content);
            if (image) formData.append("photo", image);

            if (slug) {
                await put(`/books/${slug}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                    isFormData: true,
                });
                alert("Kitap başarıyla güncellendi!");
            } else {
                await post("/books", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                    isFormData: true,
                });
                alert("Kitap başarıyla eklendi!");
            }

            handleClear();
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert("İşlem sırasında bir hata oluştu!");
        }
    };

    // Düzenleme başlat
    const handleEdit = (book: Book) => {
        navigate(`/girne/panel/kitap/${book.slug}`);
    };

    // Silme
    const handleDelete = async (id: number) => {
        if (!confirm("Bu kitabı silmek istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token yok");

            await del(`/books/${id}`, { Authorization: `Bearer ${token}` });
            alert("Kitap silindi!");
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert("Kitap silinemedi!");
        }
    };

    // Onaylama
    const handleApprove = async (id: number) => {
        if (!confirm("Bu kitabı onaylamak istediğine emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token yok");

            await put(`/books/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Kitap onaylandı!");
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert("Kitap onaylanamadı!");
        }
    };

    return (
        <>
            <span className="text-2xl font-bold mb-2">
                {slug ? "Kitap Düzenle" : "Yeni Kitap"}
            </span>

            {/* Resim ve başlık */}
            <div className="grid grid-cols-[auto_1fr] gap-4 mt-2">
                <div className="aspect-[2/3] h-50 border-2 border-dashed border-stone-400 rounded-xl flex items-center justify-center relative overflow-hidden">
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
                        placeholder="Kitap İsmi"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-400 p-2 rounded w-full"
                    />

                    <span>Yazar İsmi</span>
                    <input
                        type="text"
                        placeholder="Yazar İsmi"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border border-gray-400 p-2 rounded w-full"
                    />
                </div>
            </div>

            {/* İçerik */}
            <span className="mt-3">İçerik</span>
            <Editor setContent={setContent} content={content} shareImage={true} />

            {/* Butonlar */}
            <div className="flex w-full gap-2 justify-end mt-3">
                <button onClick={handleClear} className="bg-gray-300 px-4 py-2 rounded">
                    Temizle
                </button>
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {slug ? "Güncelle" : "Gönder"}
                </button>
            </div>

            {/* Mevcut Kitaplar */}
            <span className="text-2xl font-bold mt-6 block">Mevcut Kitaplar</span>
            <ul className="divide-y divide-stone-400">
                {books.map((book) => (
                    <li key={book.id} className="flex justify-between items-center py-2">
                        <span>{book.title}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(book)}
                                className="bg-yellow-400 px-3 py-1 rounded"
                            >
                                Düzenle
                            </button>
                            <button
                                onClick={() => handleDelete(book.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Sil
                            </button>
                            {!book.isApproved && (
                                <button
                                    onClick={() => handleApprove(book.id)}
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
