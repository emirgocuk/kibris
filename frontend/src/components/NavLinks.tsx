import { MdKeyboardArrowDown } from "react-icons/md";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

export default ({ title, menu }: { title: string; menu?: string[] }) => {
    const [open, setOpen] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (window.innerWidth >= 640) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 640) {
            timeoutRef.current = setTimeout(() => setOpen(false), 200);
        }
    };

    const handleClick = () => {
        if (window.innerWidth < 640) {
            setOpen((prev) => !prev);
        }
    };

    // Türkçe karakterleri sil ve URL uyumlu yap
    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD") // unicode ayrıştırma
            .replace(/[\u0300-\u036f]/g, "") // aksanlı harfleri kaldır
            .replace(/ç/g, "c")
            .replace(/ş/g, "s")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ö/g, "o")
            .replace(/ı/g, "i")
            .replace(/\s+/g, "-") // boşlukları tire yap
            .replace(/[^a-z0-9-]/g, ""); // diğer karakterleri temizle
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer relative font-semibold text-sm h-full"
        >
            {/* Metin ve ikon */}
            <div
                className="relative h-full flex items-center gap-1 transition-colors duration-300 ease-in-out"
                onClick={handleClick}
            >
                {menu ? (
                    <>
                        <span>{title.toUpperCase()}</span>
                        <MdKeyboardArrowDown
                            className={`transition-transform ${open ? "rotate-180" : ""}`}
                        />
                    </>
                ) : (
                    <Link to={`/${slugify(title)}`} className="relative z-10">
                        {title.toUpperCase()}
                    </Link>
                )}
            </div>

            {/* Dropdown */}
            <AnimatePresence initial={false}>
                {open && menu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute sm:top-full top-10 left-0 text-gray-950 bg-gray-50 border-t-2 border-red-500 rounded-b-md overflow-hidden shadow-lg sm:min-w-max w-full sm:w-auto z-50"
                    >
                        <ul>
                            {menu.map((item, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 whitespace-nowrap font-normal hover:bg-gray-200 cursor-pointer"
                                >
                                    <Link
                                        to={`/${slugify(item)}`}
                                        className="block w-full"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
