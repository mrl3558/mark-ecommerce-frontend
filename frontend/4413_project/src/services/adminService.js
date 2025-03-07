
const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

export const submitEdit = async (body, id) => {
    try {
        let url = `http://${host}:${port}/api/v1/products/${id}`;
        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            body: body,
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
}

export const submitEditUser = async (body) => {
    try {
        let url = `http://${host}:${port}/api/v1/users/updateUser`;
        const response = await fetch(url, {
            method: "PATCH",
            credentials: 'include',
            body: body,
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
}

export const deleteItem = async (id) => {
    try {
        let url = `http://${host}:${port}/api/v1/products/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
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
}

export const getSaleHistory = async () => {
    try {
        let url = `http://${host}:${port}/api/v1/orders`;

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
        const resp = await response.json();
        return resp;
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        let url = `http://${host}:${port}/api/v1/users/all/`;

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
        const resp = await response.json();
        return resp;
    } catch (error) {
        throw error;
    }
};

export const createItem = async (newProduct) => {
    try {
        let url = `http://${host}:${port}/api/v1/products/`;

        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newProduct
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

export const submitImage = async (imageFile, id) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
        let url = `http://${host}:${port}/api/v1/products/uploadImage/${id}`;

        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            body: formData
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

