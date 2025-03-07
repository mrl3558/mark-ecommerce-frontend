/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from "./services/cartService.js"
import { getImage } from "./services/productService.js"

function Card({ product }) {
    const [noStock, SetNoStock] = useState(false);
    const [added, setAdded] = useState(false);

    const invokeAdd = () => {
        // show a pop up underneath the card if it was added or is out of stock
        if (product.quantity < 1) {
            SetNoStock(true);
            setTimeout(() => {
                SetNoStock(false);
            }, 2000);
            return;
        }
        addToCart(product.id);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    return (
        <div className="card">
            <Link to={`/item/${product.id}`}>
                {product.image ? (
                    <img src={getImage(product)}></img>
                ) : (
                    <img src="https://via.placeholder.com/500"></img>
                )}
            </Link>
            <h2>{product.name}</h2>
            <p>{product.brand}</p>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity Remaining: {product.quantity}</p>
            <button className='addButton' onClick={invokeAdd}>Add to Cart</button>
            {noStock &&
                <p style={{ color: "red" }}>sorry, product out of stock</p>
            }
            {added &&
                <p style={{ color: "green" }}>added to cart!</p>
            }
        </div>
    );
}

export default Card;