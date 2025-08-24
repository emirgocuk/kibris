import { useState } from "react";
import Editor from "~/components/Editor";
import Section from "~/components/Section";

export default () => {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [entries, setEntries] = useState<{ name: string; content: string }[]>([]);

    const handleSubmit = () => {
        if (!name.trim() || !content.trim()) {
            alert("Lütfen isim ve içerik girin!");
            return;
        }

        setEntries((prev) => [...prev, { name, content }]);
        setName("");
        setContent("");
    };

    return (
        <Section>
            <h1 className="text-2xl font-bold mb-4">Ziyaretçi Defteri</h1>

            <div className="flex flex-col gap-2 mb-4">
                <input
                    type="text"
                    placeholder="İsim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <Editor content={content} setContent={setContent} />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                    Gönder
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-2">Gelen Ziyaretçi Mesajları</h2>
            <ul className="flex flex-col gap-2">
                {entries.map((entry, idx) => (
                    <li key={idx} className="border p-2 rounded">
                        <strong>{entry.name}:</strong>
                        <div dangerouslySetInnerHTML={{ __html: entry.content }} />
                    </li>
                ))}
            </ul>
        </Section>
    );
};
