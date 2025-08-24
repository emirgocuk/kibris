import { useEffect, useState } from "react";
import Logo from "~/assets/logo.png";
import { get } from "~/requests";
import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter, FaSquareInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface NewsItem {
    id: number;
    header: string;
    slug: string;
    title: string; // Added the missing title property
}

export default () => {
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await get<NewsItem[]>("/news?limit=5");
                console.log(res);

                setNews(res || []);
            } catch (err) {
                console.error("Haberler yüklenemedi:", err);
            }
        };

        document.title = "Galeri | Kıbrıs Türk Kültür Derneği";


        fetchNews();
    }, []);

    return (
        <footer className="bg-gray-800 border-t-2 px-6 py-8 sm:px-12 md:px-20 text-gray-50">
            <div className="flex flex-col md:flex-row md:justify-between gap-10">
                {/* Logo ve iletişim */}
                <div className="flex flex-col gap-6 md:w-1/2">
                    <img className="w-2/3 md:w-1/2" src={Logo} alt="Kibris Kultur Dernegi logo" />

                    <div className="flex gap-2 items-center">
                        <FaMapMarkerAlt className="text-red-500 text-xl" />
                        <span>Halk Sokak No:17/2 Yenişehir Çankaya Ankara</span>
                    </div>

                    <div className="flex gap-2 items-center">
                        <FaPhoneAlt className="text-red-500 font-semibold" />
                        <span>0 (312) 434 14 12</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">Sosyal Medya Hesaplari</span>
                        <div className="text-gray-500 text-4xl flex gap-3">
                            <FaFacebookSquare className="hover:text-gray-50 transition-colors" />
                            <FaSquareXTwitter className="hover:text-gray-50 transition-colors" />
                            <FaSquareInstagram className="hover:text-gray-50 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Haberler */}
                <div className="flex flex-col gap-3 md:w-1/2">
                    <div className="border-b-2 pb-3 border-red-500">
                        <span className="text-xl font-bold">Haberler</span>
                    </div>
                    <ul className="flex flex-col gap-2">
                        {news.map((item) => (
                            <li key={item.id}>
                                <Link to={`/haber/${item.slug}`} className="hover:underline">
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                        {news.length === 0 && <li>Haber bulunamadı</li>}
                    </ul>

                </div>

                <div>
                    <Link to="galeri">galeri</Link>
                </div>
            </div>
        </footer>
    );
};
