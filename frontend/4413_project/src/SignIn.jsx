import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { login } from "./services/authService.js";
import { fetchBasicUserInfo } from './services/userService.js';

function SignIn() {
    const form = useRef(null);
    const [loggedIn, setLoggedIn] = useState(null);
    const [hidden, setHidden] = useState(true);

    const redirect = useNavigate();

    const signIn = async (event) => {
        event.preventDefault();
        var info = new FormData(form.current);
        try {
            const resp = await login(info);
            // successful login
            localStorage.setItem("isLoggedIn", "true");
            setLoggedIn("true");
        } catch (error) {
            setHidden(false);
            console.error("error signing in: ", error);
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
        <div className="signin">
            {localStorage.getItem("isLoggedIn") != "true" ? (
                <div>
                    <h2 className="signInHeader">Sign In</h2><div>
                        <form ref={form} onSubmit={signIn}>
                            <p>Email</p>
                            <input type="text" name="email" placeholder="Email" className="userInput" />
                            <p>Password</p>
                            <input type="password" name="password" placeholder="Password" className="passInput" />
                            <br></br>
                            {!hidden &&
                                <p style={{ color: "red" }}>Login failed. Wrong credentials or account doesn't exist.</p>
                            }
                            <p><button type="submit" className="signInButton">Sign in</button></p>
                            <p><Link to="/signup">Don't have an account? Sign up now.</Link></p>
                        </form></div>
                </div>
            ) : (
                <><p>You are logged in.</p><p>Redirecting...</p></>
            )}

        </div>


    );
}

export default SignIn