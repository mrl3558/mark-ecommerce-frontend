const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

export const fetchBasicUserInfo = async () => {
    try {
        const url = `http://${host}:${port}/api/v1/users/showCurrentUser/`;

        // fetch basic user info
        const response = await fetch(url, {
            method: "GET",
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        // get userId from response
        var resp = await response.json();
        return resp;
    } catch (error) {
        localStorage.setItem("isLoggedIn", "false");
        throw error;
    }
};

export const fetchFullUserInfo = async (id) => {
    try {
        const url = `http://${host}:${port}/api/v1/users/user/${id}`;

        // fetch full user info
        const response = await fetch(url, {
            method: "GET",
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        const resp = await response.json();
        return resp;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (newUserInfo) => {
    try {
        const url = 'http://' + host + ':' + port + '/api/v1/users/updateUser/';
        // send request to update information
        const response = await fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserInfo)
        });
        if (!response.ok) {
            const error = new Error("bad response");
            error.status = response.status;
            throw error;
        }
        console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (oldPassword, newPassword) => {
    try {
        const url = `http://${host}:${port}/api/v1/users/updatePassword/`;

        const response = await fetch(url, {
            method: "PATCH",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
};
