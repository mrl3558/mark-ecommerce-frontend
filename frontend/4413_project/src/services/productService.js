const host = import.meta.env.VITE_HOST;
const port = import.meta.env.VITE_PORT;

// fetch single product
export const fetchProduct = async (id) => {
    let url = `http://${host}:${port}/api/v1/products/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("bad response");
    }
    const resp = await response.json();
    return resp[0];
};

// fetch all products or filtered products, use default param all if undefined
export const fetchProducts = async (category = "all", brand = "all", size = "all", color = "all", sort = "all") => {
    const baseUrl = `http://${host}:${port}/api/v1/products`;
    const filters = { category, brand, size, color };
    var url;

    if (sort != "all") {
        url = `${baseUrl}/sort/${sort}`;
    } else {

        // search the filters for one that is not "all", this is the activeFilter
        // if there is no activeFilter, then get all products
        const activeFilter = Object.entries(filters).find(([_, value]) => value !== "all" && value !== undefined);

        url = activeFilter ?
            `${baseUrl}/filter/${activeFilter[0]}/${activeFilter[1]}`
            : baseUrl;

    }

    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error('bad response');
    return await response.json();
};

// search for items based on the query
export const searchItems = async (query) => {
    let url = `http://${host}:${port}/api/v1/products/search/${query}`;

    // fetch response from backend
     const response = await fetch(url, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error('bad response');
    }
    return await response.json();

};

export const getImage = (product) => {
    const img = product.image;
    return `http://${host}:${port}/uploads/${img}`;
};