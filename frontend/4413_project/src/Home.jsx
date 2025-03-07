import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from './Card.jsx';
import { fetchProducts, searchItems } from './services/productService.js';

function Home() {
    const [category, setCategory] = useState("all");
    const [brand, setBrand] = useState("all");
    const [size, setSize] = useState("all");
    const [colour, setColour] = useState("all");
    const [sort, setSort] = useState("all");
    const sorts = ["price/asc", "price/desc", "name/asc", "name/desc"];

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colours, setColours] = useState([]);

    const [isSearch, setIsSearch] = useState(false);

    const { state } = useLocation();

    // fetch products from api
    const loadProducts = async () => {
        try {
            const data = await fetchProducts(category, brand, size, colour, sort);
            setProducts(data);
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please try again later.');
        }
    };

    useEffect(() => {
        const loadFilterOrSort = async () => {
            const data = await loadProducts(category, brand, size, colour, sort);
            setProducts(data);
        }
        loadFilterOrSort();
    }, [category, brand, size, colour, sort]);

    // Fetch all products on initial load
    // set brands and categories
    useEffect(() => {
        const loadAndSet = async () => {
            const data = await loadProducts();
            setProducts(data);
            setBrands([...new Set(data.map(product => product.brand))]);
            setCategories([...new Set(data.map(product => product.category))]);
            setSizes([...new Set(data.map(product => product.size))]);
            setColours([...new Set(data.map(product => product.color))]);
        }
        loadAndSet();
    }, []);

    // for search to work from any page, need 2 useEffects
    useEffect(() => {
        searchResults();
    }, [state]);

    useEffect(() => {
        searchResults();
    }, []);

    const searchResults = () => {
        const handleSearch = async (query) => {
            const data = await searchItems(query);
            setProducts(data);
            setIsSearch(true);
        };
        if (state && state.search) {
            handleSearch(state.search);
        } else {
            setIsSearch(false);
            loadProducts();
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setBrand("all");
        setSize("all");
        setColour("all");
    };

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
        setCategory("all");
        setSize("all");
        setColour("all");
    };

    const handleSizeChange = (event) => {
        setSize(event.target.value);
        setCategory("all");
        setBrand("all");
        setColour("all");
    };

    const handleColourChange = (event) => {
        setColour(event.target.value);
        setCategory("all");
        setBrand("all");
        setSize("all");
    };

    const handleSort = (event) => {
        setSort(event.target.value);
    };


    return (
        <div className="home">
            <h2 className="pageHeader">For Sale</h2>
            <div className="filters">
                <label>
                    Filter by category:&nbsp;
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="all">All</option>
                        {categories.map(cate => (
                            <option key={cate} value={cate}>
                                {cate}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    &nbsp;by brand:&nbsp;
                    <select value={brand} onChange={handleBrandChange}>
                        <option value="all">All</option>
                        {brands.map(b => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    &nbsp;by size:&nbsp;
                    <select value={size} onChange={handleSizeChange}>
                        <option value="all">All</option>
                        {sizes.map(b => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    &nbsp;by colour:&nbsp;
                    <select value={colour} onChange={handleColourChange}>
                        <option value="all">All</option>
                        {colours.map(b => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    &nbsp;Sort by:&nbsp;
                    <select value={sort} onChange={handleSort}>
                        <option value="all">All</option>
                        {sorts.map(b => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="products">
                {!error && products.length > 0 ? (
                    products.map(product => (
                        <Card key={product.id} product={product} />
                    ))
                ) : isSearch ? (
                    <div><p>No results found :\</p>
                        <p><Link to="/home">Back to All Products</Link></p></div>
                ) : (
                    <p>No products found</p>
                )}
            </div>
            {isSearch && products.length > 0 && (
                <div>
                    <br />
                    <p><Link to="/home">Back to All Products</Link></p>
                </div>
            )}
        </div>
    );
}

export default Home;