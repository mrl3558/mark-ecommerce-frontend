const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

export const login = async (info) => {
    try {
        const body = Object.fromEntries(info.entries());
        let url = `http://${host}:${port}/api/v1/auth/login`;

        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        // successful login
        return response;
    } catch (error) {
        throw error;
    }
}

export const signUp = async (info) => {
    try {
        var body = Object.fromEntries(info.entries());
        // allow user to sign up as admin if their email domain is mark.com
        const markUser = (body.email).split("@");
        if (markUser[1] == "mark.com") {
            body.role = "admin";
        } else body.role = "customer";
        
        let url = `http://${host}:${port}/api/v1/auth/register`;

        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        const resp = await response.json();
        return resp;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        let url = `http://${host}:${port}/api/v1/auth/logout`;

        const response = await fetch(url, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
};