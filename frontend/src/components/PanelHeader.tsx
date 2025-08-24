
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Token'ı sil
        navigate("/"); // Giriş sayfasına yönlendir
    };

    return (
        <aside className="w-3xs px-4 py-3 gap-4 flex flex-col h-screen overflow-scroll fixed">
            <Link to="/girne/panel" className="text-xl font-bold">Yönetim Paneli</Link>
            <nav className="flex flex-col gap-2">

                <Link to="/girne/panel/sayfa">Sayfa</Link>
                <Link to="/girne/panel/haber">Haber</Link>
                <Link to="/girne/panel/kitap">Kitap Tanıtım</Link>
                <Link to="/girne/panel/duyuru">Duyurular</Link>
                <Link to="/girne/panel/kullanici">Kullanıcılar</Link>
                <Link to="/girne/panel/rol">Roller</Link>
                <Link to="/girne/panel/galeri">Galeri</Link>
                <Link to="/girne/panel/uyusmazlik">Kıbrıs Uyuşmazlığı</Link>


                <button onClick={handleLogout}>Çıkış Yap</button>
            </nav>
        </aside>
    );
}
