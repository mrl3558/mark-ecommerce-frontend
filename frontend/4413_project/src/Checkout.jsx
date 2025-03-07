import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CartItems from "./CartItems.jsx";
import { getCart } from "./services/cartService.js";
import { submitOrder } from "./services/orderService.js";


function Checkout() {

    const [products, setProducts] = useState([]);
    const [useCustom, setCustom] = useState(false);
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [country, setCountry] = useState("Canada");
    const [postal, setPostal] = useState("");
    const [inputError, setInputError] = useState(false);


    // get the values passed from cart via state
    const { state } = useLocation();
    const { totalQuantity, orderTotal } = state;
    const navigate = useNavigate();

    const handleOrder = async (event) => {
        event.preventDefault();
        var customAddress = [];

        // if customer wants to use an address different to one on their account
        if (useCustom) {
            customAddress = {
                street: street,
                city: city,
                province: province,
                country: country,
                postal: postal
            }
        }

        if (Object.values(customAddress).some(info => info == null || info == "")) {
            setInputError(true);
            return;
        }

        try {
            const resp = await submitOrder(customAddress);
            // successful order, empty cart and send to order summary page
            localStorage.removeItem("cart");
            navigate("/ordersummary", { state: { orderID: resp.orderID, fromRedirect: true } });
        } catch (error) {
            console.error('error processing order: ', error);
        }
    }

    // this is here because cartItems requires a function because of Cart, easy fix
    const useless = () => { }

    const toggleCustom = () => {
        setCustom(!useCustom);
    }

    useEffect(() => {
        getCart(setProducts);
    }, []);

    return (
        <div className="checkout">
            <h2 className="pageHeader">Checkout</h2>
            <div className="checkout-container">
                <div className="checkoutItems">
                    {products.length > 0 ? (
                        products.map(product => (
                            <CartItems key={product.id} product={product} onQuantityChange={useless} editable={false} />
                        ))
                    ) : (
                        <p>No products in cart</p>
                    )}

                    <div className="shipping">
                        <h3>Shipping Address:</h3>
                        <input name="address" id="default" type="radio" onChange={toggleCustom} defaultChecked />
                        <label htmlFor="default"><b>Use Default Address</b></label>
                        <br /><br />
                        <input name="address" id="custom" type="radio" onChange={toggleCustom} />
                        <label htmlFor="custom"><b>Use custom shipping address</b></label>

                        {useCustom ? (
                            <div>
                                {inputError &&
                                    <p style={{ color: "red" }}><b>Please input correct shipping information into all fields</b></p>
                                }
                                <p>Street Address</p>
                                <input type="text" name="street" placeholder="Street Address" className="billAdrInput" value={street} onChange={(e) => { setStreet(e.target.value) }} required />
                                <p>City</p>
                                <input type="text" name="city" placeholder="City" className="billAdrInput" value={city} onChange={(e) => { setCity(e.target.value) }} required />
                                <p>Province</p>
                                <input type="text" name="province" placeholder="Province" className="billAdrInput" value={province} onChange={(e) => { setProvince(e.target.value) }} required />
                                <p>Country</p>
                                <input type="text" name="country" placeholder="Country" className="billAdrInput" value={country} onChange={(e) => { setCountry(e.target.value) }} required />
                                <p>Postal Code</p>
                                <input type="text" name="postalCode" placeholder="Postal Code" className="billAdrInput" value={postal} onChange={(e) => { setPostal(e.target.value) }} required />
                            </div>
                        ) : (<></>)}
                    </div>
                </div>

                <div className="order-container">
                    <div className="orderText">
                        <p>Total Quantity: {totalQuantity}</p>
                        <h3><b>Order Total: ${orderTotal.toFixed(2)}</b></h3>
                    </div>
                    <Link to="/order">
                        <button className="checkoutButton" onClick={handleOrder}>Checkout</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
