import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { Search } from 'react-bootstrap-icons';
import './search.css'; // Search CSS file ka Import

// Browse Categories ka data
const browseCategories = [
    { name: "Top Hits", color: "#DC2626" }, { name: "Bollywood", color: "#D97706" },
    { name: "Punjabi", color: "#65A30D" }, { name: "Pop", color: "#059669" },
    { name: "Ghazals", color: "#0891B2" }, { name: "Workout", color: "#0284C7" },
    { name: "Romance", color: "#4F46E5" }, { name: "Party", color: "#7C3AED" },
];

function SearchPage({ onPlaySong }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]); // Search results ya category songs
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState({ type: 'none', value: '' }); // 'none', 'search', 'category'
    const navigate = useNavigate();
    const location = useLocation();

    // URL se initial filter check karein (agar user ne URL manually enter kiya ho)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');
        const query = queryParams.get('q'); // Agar koi direct search query bhi ho URL mein

        if (category) {
            setActiveFilter({ type: 'category', value: category });
            fetchCategorySongs(category);
        } else if (query) {
            setSearchTerm(query); // Search term ko update karein
            setActiveFilter({ type: 'search', value: query });
            fetchSearchResults(query);
        } else {
            setActiveFilter({ type: 'none', value: '' });
            setResults([]); // Reset results agar koi filter nahi hai
        }
    }, [location.search]); // Jab URL ka search part change ho, tab effect run karein

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/songs/search?q=${query}`);
            setResults(data);
        } catch (error) {
            console.error("Error searching songs:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorySongs = async (category) => {
        setLoading(true);
        try {
            // Assume your backend has an endpoint to filter by genre/category
            // Example: http://localhost:5000/api/songs/search?genre=Bollywood
            const { data } = await axios.get(`http://localhost:5000/api/songs/search?genre=${category}`);
            setResults(data);
        } catch (error) {
            console.error(`Error fetching songs for category ${category}:`, error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            // Agar search term empty hai, toh categories dikhao
            setActiveFilter({ type: 'none', value: '' });
            setResults([]);
            navigate('/search'); // Clear URL query params
            return;
        }

        setActiveFilter({ type: 'search', value: searchTerm.trim() });
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); // URL mein search term add karein
        fetchSearchResults(searchTerm.trim());
    };

    const handleCategoryClick = (categoryName) => {
        setSearchTerm(''); // Search bar clear karein
        setActiveFilter({ type: 'category', value: categoryName });
        navigate(`/search?category=${encodeURIComponent(categoryName)}`); // URL mein category add karein
        fetchCategorySongs(categoryName);
    };

    const displayTitle = () => {
        if (activeFilter.type === 'search') {
            return `Results for "${activeFilter.value}"`;
        } else if (activeFilter.type === 'category') {
            return `${activeFilter.value} Songs`;
        }
        return "Browse All";
    };

    return (
        <div>
            <h1 className="display-4 fw-bold mb-4">Search</h1>

            <form onSubmit={handleSearch} className="mb-5">
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-dark border-secondary text-white"><Search /></span>
                    <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Search for songs or artists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">Search</button>
                </div>
            </form>

            {/* MARGIN ADDED: mb-5 class lagaya hai taaki footer se pehle space mile */}
            <section className="mb-5"> 
                <h2 className="section-title text-capitalize">{displayTitle()}</h2>
                
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    <>
                        {/* Agar koi filter active nahi hai, toh categories dikhao */}
                        {activeFilter.type === 'none' && (
                            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
                                {browseCategories.map((category, index) => (
                                    <div key={index} className="col">
                                        <div 
                                            className="category-card text-white text-decoration-none d-block p-3 rounded h-100 cursor-pointer" 
                                            style={{ backgroundColor: category.color }}
                                            onClick={() => handleCategoryClick(category.name)}
                                            role="button"
                                        >
                                            <h4 className="fw-bold">{category.name}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Agar filter active hai (search ya category), toh results dikhao */}
                        {(activeFilter.type === 'search' || activeFilter.type === 'category') && (
                            results.length === 0 ? (
                                <p className="text-muted text-center">
                                    No results found for "{activeFilter.value}"
                                </p>
                            ) : (
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                                    {results.map(song => (
                                        <div className="col" key={song._id}>
                                            <SongCard song={song} onPlay={onPlaySong} />
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default SearchPage;