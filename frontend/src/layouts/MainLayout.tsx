import { Outlet } from "react-router-dom";

import Header from "~/components/Header";
import Footer from "~/components/Footer";

export default () => {
    return <div className="flex flex-col min-h-screen">
        <Header />

        <Outlet />

        <Footer />
    </div>
}