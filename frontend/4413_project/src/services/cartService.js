import { fetchProduct } from "./productService.js"

// moved to own file because needed in checkout too
export const getCart = async (setProducts) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const fetchedProducts = [];

  for (let i = 0; i < cart.length; i++) {
    const product = cart[i];
    const ret = await fetchProduct(product.id);
    if (ret) {
      fetchedProducts.push(ret);
    }
  }
  setProducts(fetchedProducts);
};

export const addToCart = (productId) => {
  // get cart from local storage, or initialize empty
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  // find if product is already in cart
  const productIndex = cart.findIndex((item) => item.id == productId);

  if (productIndex !== -1) {
    cart[productIndex].quantity += 1;
  } else {
    // create new entry if not in cart
    const productToAdd = {
      id: productId,
      quantity: 1,
    };
    cart.push(productToAdd);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};
