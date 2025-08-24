import { Link } from "react-router-dom";

type ConflictProps = {
    id?: number;
    title: string;
    author?: string;
    date?: string;
    slug?: string;
};

export default ({ title, author = "Admin", date, slug }: ConflictProps) => {
    return (
        <Link
            to={slug ? `/kibris-uyusmazligi/p/${slug}` : "#"}
            className="py-2 cursor-pointer group"
        >
            {/* Başlık */}
            <span className="text-base py-2 font-semibold text-gray-800 group-hover:text-bayrak transition-colors">
                {title}
            </span>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{author}</span>
                <span className="text-gray-300">|</span>
                <span>{date || new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
        </Link>
    );
};
