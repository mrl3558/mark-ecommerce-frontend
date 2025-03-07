import CartItems from "./CartItems";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getCart } from "./services/cartService.js"
import { fetchBasicUserInfo } from "./services/userService.js";

function Cart() {
    const [products, setProducts] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [checkoutFlag, setCheckoutFlag] = useState(0);
    const [hidden, setHidden] = useState(true);

    const navigate = useNavigate();

    // update the total values on the cart page immediately
    const updateTotals = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        var newOrderTotal = 0;
        var newTotalQuantity = 0;

        cart.forEach(item => {
            // if item is out of stock
            if (item.quantity < 1) {
                return;
            }
            const product = products.find(product => item.id == product.id);
            newOrderTotal += product.price * item.quantity;
            newTotalQuantity += item.quantity;
        });

        setOrderTotal(newOrderTotal);
        setTotalQuantity(newTotalQuantity);
    };

    // go to checkout page
    const checkout = async () => {

        try {
            await fetchBasicUserInfo();
            if (products < 1) {
                setHidden(false);
                setTimeout(() => {
                    setHidden(true);
                }, 2000);
                return;
            } else navigate("/checkout", { state: { orderTotal: orderTotal, totalQuantity: totalQuantity } });
        } catch (error) {
            setCheckoutFlag(1);
            setTimeout(() => {
                navigate("/signin");
            }, 2000);
        }

    }

    // on load get the cart products
    // reload when the order total changes so that if an item gets deleted, it removed from display immediately
    useEffect(() => {
        getCart(setProducts);
    }, [, orderTotal]);

    return (
        <div className="cart">
            <h2 className="pageHeader">Shopping Cart</h2>
            <div className="cart-container">
                <div className="cartItems">
                    {checkoutFlag ? (
                        <p>You are not logged in. Please sign in or sign up to continue.</p>
                    ) : (
                        <div>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <CartItems key={product.id} product={product} onQuantityChange={updateTotals} editable={true} />
                                ))
                            ) : (
                                <><p>No products in cart</p>
                                    {!hidden &&
                                        <p>Nothing to checkout</p>
                                    }
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="buy-container">
                    <div className="buyText">
                        <p>Total Quantity: {totalQuantity}</p>
                        <h3><b>Order Total: ${orderTotal.toFixed(2)}</b></h3>
                    </div>
                    <button className="checkoutButton" onClick={checkout}>Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Cart