import { useState, useEffect } from "react";
import { AiFillCaretLeft, AiFillCaretRight, AiOutlineClose } from "react-icons/ai";
import { get } from "~/requests";
import Section from "~/components/Section";
import { AnimatePresence, motion } from "motion/react";

type PhotoInfo = {
    id: number;
    isShared: boolean;
};

export default function CategoryManager() {
    const [open, setOpen] = useState<boolean>(false);
    const [photoIndex, setPhotoIndex] = useState<number>(0);
    const [existingPhotos, setExistingPhotos] = useState<PhotoInfo[]>([]);

    // Fotoğrafları çek
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

    const sharedPhotos = existingPhotos.filter((p) => p.isShared);

    const showPhoto = (index: number) => {
        setOpen(true);
        setPhotoIndex(index);
    };

    const prevPhoto = () => {
        setPhotoIndex((prev) =>
            prev === 0 ? sharedPhotos.length - 1 : prev - 1
        );
    };

    const nextPhoto = () => {
        setPhotoIndex((prev) =>
            prev === sharedPhotos.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <Section>
            <h1>Galeri</h1>

            <div className="grid grid-cols-5 gap-4 mt-4">
                {sharedPhotos.length > 0 ? (
                    sharedPhotos.map((p, index) => (
                        <div
                            key={p.id}
                            className="w-full aspect-square rounded-lg overflow-hidden cursor-pointer transition"
                            onClick={() => showPhoto(index)}
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

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="fixed flex items-center bg-stone-950/80 backdrop-blur-sm w-screen h-screen top-0 left-0 z-50 p-4"
                    >
                        {/* Sol Ok */}
                        <button
                            onClick={prevPhoto}
                            className="bg-transparent border-0 text-stone-50 p-4"
                        >
                            <AiFillCaretLeft className="text-5xl" />
                        </button>

                        {/* Görsel */}
                        <div className="flex-1 h-full flex items-center justify-center">
                            <img
                                src={`${import.meta.env.VITE_API_ENDPOINT}/gallery/${sharedPhotos[photoIndex].id}`}
                                alt={`photo-${sharedPhotos[photoIndex].id}`}
                                className="max-h-screen object-contain rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Sağ Ok */}
                        <button
                            onClick={nextPhoto}
                            className="bg-transparent border-0 text-stone-50 p-4"
                        >
                            <AiFillCaretRight className="text-5xl" />
                        </button>

                        {/* Kapat Butonu */}
                        <button
                            className="fixed top-4 right-4 bg-transparent border-0 text-stone-50"
                            onClick={() => setOpen(false)}
                        >
                            <AiOutlineClose className="text-2xl" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Section>
    );
}
