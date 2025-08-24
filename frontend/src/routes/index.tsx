import { createBrowserRouter } from "react-router-dom"

import MainLayout from "~/layouts/MainLayout"
import AdminLayout from "~/layouts/AdminLayout"

import Home from "~/pages/home"
import Page from "~/pages/page"
import Login from "~/pages/login"
import Book from "~/pages/book"
import New from "~/pages/new"
import Conflict from "~/pages/conflict"
import Announcement from "~/pages/announcement"
import Publications from "~/pages/publications"
import News from "~/pages/news"
import Conflicts from "~/pages/conflicts"
import Gallery from "~/pages/gallery"
import User from "~/pages/user"
import Guest from "~/pages/guest"

import PanelHome from "~/pages/Panel/home"
import PanelPages from "~/pages/Panel/pages"
import PanelNews from "~/pages/Panel/news"
import PanelBook from "~/pages/Panel/book"
import PanelAnnouncement from "~/pages/Panel/announcement"
import PanelUser from "~/pages/Panel/user"
import PanelRole from "~/pages/Panel/roles"
import PanelGallery from "~/pages/Panel/gallery"
import PanelConflict from "~/pages/Panel/conflict"



const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: ":slug",
                element: <Page />,
            },
            {
                path: "duyuru/:id",
                element: <Announcement />,
            },
            {
                path: "haber/:slug",
                element: <New />,
            },
            {
                path: "kitap/:slug",
                element: <Book />,
            },
            {
                path: "kutuphanemiz/:page?",
                element: <Publications />,
            },
            {
                path: "haberler/:page?",
                element: <News />,
            },
            {
                path: "kibris-uyusmazligi/page?",
                element: <Conflicts />,
            },
            {
                path: "kibris-uyusmazligi/p/:slug",
                element: <Conflict />,
            },
            {
                path: "galeri",
                element: <Gallery />,
            },
            {
                path: "yazar/:id",
                element: <User />,
            },
            {
                path: "ziyaretci-defteri",
                element: <Guest />,
            },
        ],
    },
    {
        path: "/girne",
        element: <Login />,
    },
    {
        path: "/girne/panel",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <PanelHome />,
            },
            {
                path: "/girne/panel/sayfa/:slug?",
                element: <PanelPages />,
            },
            {
                path: "/girne/panel/haber/:slug?",
                element: <PanelNews />,
            },
            {
                path: "/girne/panel/kitap/:slug?",
                element: <PanelBook />,
            },
            {
                path: "/girne/panel/duyuru/:id?",
                element: <PanelAnnouncement />,
            },
            {
                path: "/girne/panel/kullanici/:id?",
                element: <PanelUser />,
            },
            {
                path: "/girne/panel/rol/:id?",
                element: <PanelRole />,
            },
            {
                path: "/girne/panel/galeri",
                element: <PanelGallery />,
            },
            {
                path: "/girne/panel/uyusmazlik/:slug?",
                element: <PanelConflict />,
            },
        ],
    }
])

export default routes
