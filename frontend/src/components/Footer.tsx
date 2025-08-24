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
    title: string;
}

export default () => {
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await get<NewsItem[]>("/news?limit=5");
                setNews(res || []);
            } catch (err) {
                console.error("Haberler yüklenemedi:", err);
            }
        };

        fetchNews();
    }, []);

    return (
        <footer className="bg-gray-800 text-gray-300 px-6 py-12 sm:px-12 md:px-20">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Logo ve İletişim */}
                <div className="flex flex-col gap-6">
                    <img className="w-2/3 md:w-1/2" src={Logo} alt="Kibris Kultur Dernegi logo" />
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3 items-center">
                            <FaMapMarkerAlt className="text-red-500 text-xl flex-shrink-0" />
                            <span>Halk Sokak No:17/2 Yenişehir Çankaya Ankara</span>
                        </div>
                        <div className="flex gap-3 items-center">
                            <FaPhoneAlt className="text-red-500" />
                            <span>0 (312) 434 14 12</span>
                        </div>
                    </div>
                </div>

                {/* Haberler */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-2">Son Haberler</h3>
                    <ul className="flex flex-col gap-3 mt-2">
                        {news.map((item) => (
                            <li key={item.id}>
                                <Link to={`/haber/${item.slug}`} className="hover:text-white hover:underline transition-colors">
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                        {news.length === 0 && <li>Haber bulunamadı</li>}
                    </ul>
                </div>

                {/* Sosyal Medya ve Hızlı Linkler */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-2">Bizi Takip Edin</h3>
                    <div className="text-4xl flex gap-4 mt-2">
                        <a href="#" className="hover:text-white transition-colors"><FaFacebookSquare /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaSquareXTwitter /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaSquareInstagram /></a>
                    </div>
                    <div className="mt-4">
                        <Link to="/galeri" className="hover:text-white hover:underline">Galeri</Link>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500 mt-10 pt-5 border-t border-gray-700">
                © 2025 Kıbrıs Türk Kültür Derneği. Tüm hakları saklıdır.
            </div>
        </footer>
    );
};