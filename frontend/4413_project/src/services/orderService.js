const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

export const submitOrder = async (customAddress) => {
    try {
        let url = `http://${host}:${port}/api/v1/orders`;

        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: JSON.parse(localStorage.getItem("cart")),
                customAddress: customAddress
            }),
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

export const getUserOrders = async () => {
    try {
        let url = `http://${host}:${port}/api/v1/orders/showAllMyOrders`;

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

export const updateOrder = async (orderID) => {
    try {
        let url = `http://${host}:${port}/api/v1/orders/${orderID}`;

        const response = await fetch(url, {
            method: "PATCH",
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
}

export const getOrderInfo = async (orderID) => {
    try {
        let url = `http://${host}:${port}/api/v1/orders/${orderID}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
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