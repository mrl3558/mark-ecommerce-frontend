import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { signUp } from "./services/authService.js";
import { fetchBasicUserInfo } from './services/userService.js';

function SignUp() {
    const form = useRef(null);
    const [loggedIn, setLoggedIn] = useState(null);

    const redirect = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const info = new FormData(form.current);
        try {
            const resp = await signUp(info);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(resp));
            setLoggedIn(true);
        } catch (error) {
            console.error("error signing up:", error);
        }
    }

    useEffect(() => {
        const doRedirect = async () => {
            try {
                if (await fetchBasicUserInfo()) {
                    setTimeout(() => {
                        redirect("/home");
                    }, 1000);
                }
            } catch (error) {
                setLoggedIn(false);
                console.error("not logged in: ", error);
            }
        }
        doRedirect();
    }, [, loggedIn]);


    return (
        <div className="signup">
            {localStorage.getItem("isLoggedIn") != "true" ? (
                <div>
                    <h2 className="signUpHeader">Sign Up</h2>
                    <form ref={form} onSubmit={handleSubmit}>
                        <p>First Name</p>
                        <input type="text" name="firstName" placeholder="First Name" className="userInput" required />
                        <p>Last Name</p>
                        <input type="text" name="lastName" placeholder="Last Name" className="userInput" required />
                        <p>Email</p>
                        <input type="email" name="email" placeholder="Email" className="userInput" required />
                        <p>Phone Number</p>
                        <input type="text" name="phone" placeholder="Phone Number" className="userInput" required />
                        <p>Password</p>
                        <input type="password" name="password" placeholder="Password" className="passInput" required />

                        <p>Street Address</p>
                        <input type="text" name="street" placeholder="Street Address" className="billAdrInput" required />
                        <p>City</p>
                        <input type="text" name="city" placeholder="City" className="billAdrInput" required />
                        <p>Province</p>
                        <input type="text" name="province" placeholder="Province" className="billAdrInput" required />
                        <p>Country</p>
                        <input type="text" name="country" placeholder="Country" className="billAdrInput" defaultValue={"Canada"} required />
                        <p>Postal Code</p>
                        <input type="text" name="postalCode" placeholder="Postal Code" className="billAdrInput" required />

                        <p><button type="submit" className='signUpButton'>Sign up</button></p>
                        <p><Link to="/signin">Already have an account? Sign in now.</Link></p>
                    </form>
                </div>
            ) : (
                <><p>You are logged in.</p><p>Redirecting...</p></>

            )}
        </div>
    );
}

export default SignUp