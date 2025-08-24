import { Outlet } from "react-router-dom";

import Header from "~/components/Header";
import Footer from "~/components/Footer";

export default () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {/* Sayfa içeriğini saran ve yanlardan boşluk veren sarmalayıcı */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};