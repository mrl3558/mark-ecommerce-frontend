import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/Mark.png"

function Navbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // take the query entered and pass it to home component to request from backend and then render
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // if search query actually contains something
        if (search.trim()) {
            navigate('/home', { state: { search: search.trim() } });
            setSearch("");
        }
    };

    return (
        <div className="navbar">
            <div className="logo-container">
                <Link to="home"><img src={logo} alt="logo" className="logo"></img></Link>
            </div>
            <div className="search-container">
                <form onSubmit={handleSearchSubmit}>
                    <input type="text" placeholder="Search..." className="search"
                        value={search} onChange={handleSearchChange} />
                    <button type="submit" className="searchButton">Search</button>
                </form>
            </div>
            <nav className="links">
                <Link className="links" to="home"> Home</Link>
                <Link className="links" to="cart"> Cart</Link>
                <Link className="links" to="signin"> Sign In</Link>
                <Link className="links" to="signup"> Sign Up</Link>
                <Link className="links" to="profile"> Profile</Link>
            </nav>
        </div>
    );
}

export default Navbar;