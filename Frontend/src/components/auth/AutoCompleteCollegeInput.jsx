import React, { useState, useEffect } from "react";

const AutoCompleteCollegeInput = ({ value, onChange, label }) => {
    const [query, setQuery] = useState(value || "");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);

        // Try to fetch from local AISHE JSON (you need to store /public/aishe_colleges.json)
        const fetchAISHE = async () => {
            try {
                const resp = await fetch("/aishe_colleges.json");
                const colleges = await resp.json();
                const filtered = colleges
                    .filter((c) => c.institution_name.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 20);
                if (filtered.length > 0) {
                    setResults(filtered.map((c) => ({ name: c.institution_name })));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // fallback to other API if local fetch fails
            }
            // fallback: call public search
            fetch(`https://universities.hipolabs.com/search?name=${query}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.slice(0, 20).map((d) => ({ name: d.name })));
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        };

        const debounce = setTimeout(fetchAISHE, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (name) => {
        setQuery(name);
        onChange(name);
        setShowList(false);
    };

    return (
        <div className="relative">
            <label className="text-[10px] font-medium text-gray-300 block mb-1">{label}</label>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChange(e.target.value);
                    setShowList(true);
                }}
                placeholder="Search College / School"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-[11px] text-gray-200"
            />

            {loading && <p className="text-[10px] text-cyan-400 mt-1">Searching…</p>}

            {showList && results.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded max-h-40 overflow-y-auto z-50 text-[11px] customScroll">
                    {results.map((item, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleSelect(item.name)}
                            className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-gray-200"
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}

            {showList && !loading && results.length === 0 && query.length >= 2 && (
                <p className="text-[10px] text-gray-400 mt-1">No institution found — you can type manually.</p>
            )}

            <style>{`
        .customScroll::-webkit-scrollbar { width: 4px; }
        .customScroll::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default AutoCompleteCollegeInput;
