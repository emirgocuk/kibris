import Logo from "~/assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import NavLinks from "./NavLinks";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="px-4 py-2 bg-stone-50 w-full flex items-center justify-between border-b-2 border-stone-300  z-10 shadow-sm">
            <Link to="/">
                <img className="h-10" src={Logo} alt="Kıbrıs Kültür Derneği logo" />
            </Link>

            {/* Hamburger butonu */}
            <button
                className="max-[1162px]:block hidden text-2xl"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>

            {/* Menü */}
            <nav
                className={`
                    flex gap-4 h-10
                    max-[1162px]:absolute max-[1162px]:top-full max-[1162px]:left-0
                    max-[1162px]:w-full max-[1162px]:bg-stone-50 max-[1162px]:flex-col max-[1162px]:p-4
                    ${mobileOpen ? "max-[1162px]:flex" : "max-[1162px]:hidden"}
                `}
            >
                <NavLinks title="Kurumsal" menu={["Tarihçe", "Tüzük", "Üyelik", "Sıkça Sorular", "Mali Bilgiler", "Burs İşlemleri"]} />
                <NavLinks title="Yönetim" menu={["Genel Merkaz", "Antalya", "İstanbul", "İzmir", "Mersin"]} />
                <NavLinks title="Kıbrıs" menu={["Kıbrıs Uyuşmazlığı", "Kültürel Etkinlikler", "Kıbrıs ile İlgili Tavsiyeler", "Kıbrıs Türk Kültürü", "Önemli Gün ve Haftalar"]} />
                <NavLinks title="Kütüphanemiz" />
                <NavLinks title="Basın" menu={["Basın Açıklamaları", "Basında Biz", "Basında KKTC"]} />
                <NavLinks title="İletişim" menu={["Bize Ulaşın"]} />
                <NavLinks title="Üyelik Formu" />
            </nav>
        </header>
    );
};
