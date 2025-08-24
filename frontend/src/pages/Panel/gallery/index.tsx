import { useState, useEffect } from "react";
import { AiFillFileImage } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { get, post, del } from "~/requests";

type PhotoInfo = {
    id: number;
    isShared: boolean;
};

export default function CategoryManager() {
    const [dragging, setDragging] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<PhotoInfo[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    // Tüm fotoğraf ID ve durumlarını çek
    const fetchPhotos = async () => {
        try {
            const data = await get<PhotoInfo[]>("/gallery/ids");
            setExistingPhotos(data);
        } catch (err) {
            console.error("Fotoğraflar çekilemedi:", err);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages((prev) => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
        );
        if (files.length > 0) setImages((prev) => [...prev, ...files]);
    };

    const handleSubmit = async () => {
        if (images.length === 0) return alert("Lütfen en az bir görsel ekleyin!");

        setLoading(true);
        try {
            const formData = new FormData();
            images.forEach((file) => formData.append("photo", file));

            await post("/gallery", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
                isFormData: true,
            });

            alert(`${images.length} görsel başarıyla gönderildi!`);
            setImages([]);
            await fetchPhotos();
        } catch (err) {
            console.error(err);
            alert("Fotoğraflar yüklenemedi.");
        }
        setLoading(false);
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return alert("Seçili görsel yok!");
        try {
            for (const id of selectedIds) {
                await del(`/gallery/${id}`, {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                });
            }
            setExistingPhotos((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } catch (err) {
            console.error(err);
            alert("Silme işlemi başarısız!");
        }
    };

    const sharedPhotos = existingPhotos.filter((p) => p.isShared);
    const unsharedPhotos = existingPhotos.filter((p) => !p.isShared);

    return (
        <div className="flex flex-col gap-6 w-full">
            <span className="text-2xl font-bold">Galeri</span>

            {/* Resim Ekleme Alanı */}
            <label
                htmlFor="fileInput"
                className={`flex flex-col items-center justify-center h-96 rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-300 ${dragging ? "border-blue-500 bg-blue-50" : "border-stone-400"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <AiFillFileImage
                    className={`text-5xl transition-colors ${dragging ? "text-blue-500" : "text-stone-400"}`}
                />
                <span className="text-stone-500 text-lg">
                    Görsel eklemek için tıkla veya sürükle bırak
                </span>
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </label>

            {/* Önizleme */}
            <div className="grid grid-cols-5 gap-4 mt-4">
                <AnimatePresence>
                    {images.length > 0 ? (
                        images.map((file, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full aspect-square rounded-lg overflow-hidden shadow"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`upload-${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    onClick={() =>
                                        setImages((prev) => prev.filter((_, i) => i !== index))
                                    }
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs hover:bg-red-500 transition"
                                >
                                    Sil
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-stone-400 col-span-5">Henüz görsel eklenmedi.</p>
                    )}
                </AnimatePresence>
            </div>

            {/* Kaydet Butonu */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-3 mt-4 rounded-xl font-semibold text-white transition-colors duration-300 shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
                {loading ? "Yükleniyor..." : "Kaydet"}
            </motion.button>

            {/* Paylaşılan Fotoğraflar */}
            <div>
                <span className="text-xl font-bold">Paylaşılan Fotoğraflar</span>
                <div className="grid grid-cols-5 gap-4 mt-4">
                    {sharedPhotos.length > 0 ? (
                        sharedPhotos.map((p) => (
                            <div
                                key={p.id}
                                className={`relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition ${selectedIds.includes(p.id) ? "border-blue-500" : "border-transparent"}`}
                                onClick={() => toggleSelect(p.id)}
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_ENDPOINT}/gallery/${p.id}`}
                                    alt={`photo-${p.id}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-400 col-span-5">Henüz paylaşılmış fotoğraf yok.</p>
                    )}
                </div>
            </div>

            {/* Paylaşılmayan Fotoğraflar */}
            <div>
                <span className="text-xl font-bold">Paylaşılmayan Fotoğraflar</span>
                <div className="grid grid-cols-5 gap-4 mt-4">
                    {unsharedPhotos.length > 0 ? (
                        unsharedPhotos.map((p) => (
                            <div
                                key={p.id}
                                className={`relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition ${selectedIds.includes(p.id) ? "border-blue-500" : "border-transparent"}`}
                                onClick={() => toggleSelect(p.id)}
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_ENDPOINT}/gallery/${p.id}`}
                                    alt={`photo-${p.id}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-400 col-span-5">Henüz paylaşılmamış fotoğraf yok.</p>
                    )}
                </div>
            </div>

            {/* Seçili Resimleri Sil Butonu */}
            {selectedIds.length > 0 && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteSelected}
                    className="px-6 py-3 mt-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md"
                >
                    {selectedIds.length} Resmi Sil
                </motion.button>
            )}
        </div>
    );
}
