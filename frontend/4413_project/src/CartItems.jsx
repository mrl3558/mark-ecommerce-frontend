import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImage } from "./services/productService.js";

function CartItems({ product, onQuantityChange, editable }) {
    const [quantity, setQuantity] = useState(1);

    // update the cart in localStorage
    const updateCart = (productId, newQuantity) => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const updatedCart = cart.map(item => {
            if (item.id == productId) {
                const totalPrice = newQuantity * product.price;
                return { ...item, quantity: newQuantity, totalPrice };
            }
            return item;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        onQuantityChange();
    }

    // make the input actually use the min max values
    // then, update cart to new value
    const cartValue = (event) => {
        const value = parseInt(event.target.value);
        const min = 1;
        const max = parseInt(event.target.max);

        const newQuantity = Math.max(min, Math.min(value, max));
        setQuantity(newQuantity);
        updateCart(product.id, newQuantity);
    }

    // if the value is changed to be blank, set it to what it was before
    const handleNaN = () => {
        if (isNaN(quantity) || quantity == "") {
            setQuantity(1);
            updateCart(product.id, 1);
        }
    }

    const removeItem = () => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const itemRemoved = cart.filter(item => item.id != product.id);
        console.log(itemRemoved);

        localStorage.setItem("cart", JSON.stringify(itemRemoved));
        onQuantityChange();
    }

    // on load, set the quantity to the value in cart
    // update cart value if it is over max
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const cartItem = cart.find(item => item.id == product.id);
        if (cartItem) {
            const min = 1;
            const max = product.quantity;
            const initialQuantity = Math.max(min, Math.min(cartItem.quantity, max));

            setQuantity(initialQuantity);
            updateCart(product.id, initialQuantity);
        }
    }, []);

    return (
        <div className="cartItem">
            <Link to={`/item/${product.id}`}>
                {product.image ? (
                    <img src={getImage(product)}></img>
                ) : (
                    <img src="https://via.placeholder.com/500"></img>
                )}
            </Link>
            <div className="cartInfo">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Colour: {product.color}</p>
            </div>

            <div className="cartEdit">
                {editable ? (
                    <><h3 className="removeItem">Remove Item<button onClick={removeItem}>X</button></h3>
                        <h3>Price ${product.price}</h3>
                        <label>Quantity:
                            <input type="number" min="1" max={product.quantity} value={quantity}
                                onChange={cartValue} onBlur={handleNaN}>
                            </input>
                        </label></>
                ) : (
                    <><h3>Price ${product.price}</h3>
                        <p>Quantity: {quantity}</p></>
                )}
            </div>
        </div>
    );
}

export default CartItems