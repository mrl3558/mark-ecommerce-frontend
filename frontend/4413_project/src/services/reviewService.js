const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

// fetch all reviews of specific product
export const fetchReviews = async (productID) => {
    try {
        let url = `http://${host}:${port}/api/v1/reviews/${productID}`;
        const response = await fetch(url, {
            method: "GET",
        });
        if (!response.ok) {
            // if no reviews found, return empty object instead of error
            if (response.status == 404) {
                return [];
            } else throw new Error('bad response');
        }
        const resp = await response.json();
        return resp;
    } catch (error) {
        throw error;
    }
};

export const createReview = async (productID, userID, reviewText, rating) => {
    try {
        let url = `http://${host}:${port}/api/v1/reviews/`;
        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemID: productID, userID, comment: reviewText, rating })
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateReview = async (reviewID, reviewText, rating) => {
    try {
        let url = `http://${host}:${port}/api/v1/reviews/${reviewID}`;
        const response = await fetch(url, {
            method: "PATCH",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: reviewText, rating })
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteReview = async (reviewID) => {
    try {
        let url = `http://${host}:${port}/api/v1/reviews/${reviewID}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('bad response');
        }
        return response;
    } catch (error) {
        throw error;
    }
};