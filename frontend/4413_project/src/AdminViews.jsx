import React, { useState, useEffect } from 'react';
import { submitEdit, deleteItem, submitEditUser, createItem, submitImage } from './services/adminService.js';

// element to view salesHistory, calls another element that shows specific order details when view more is clicked
export const SalesView = ({ saleHistory, onViewMore, onClose }) => {

    // Filter out duplicates and sort by orderId
    const processedSaleHistory = [...new Map(saleHistory.map(item => [item.orderId, item])).values()]
        .sort((a, b) => a.orderId - b.orderId);

    return (
        <div className="sales">
            <table className="salesTable">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total Price</th>
                        <th>Name: UserId</th>
                        <th>Date Ordered</th>
                        <th>Ship To</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {processedSaleHistory.map((order) => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>${order.totalAmount}</td>
                            <td>{order.firstName} {order.lastName}: {order.userId}</td>
                            <td>{new Date(order.dateOfPurchase).toUTCString()}</td>
                            <td>{order.shippingCity}, {order.shippingProvince}</td>
                            <td><button onClick={() => onViewMore(order)}>View More</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button type="button" onClick={onClose}>Exit</button>
        </div>
    );
};

// element to view inventory, calls another element to edit item when edit button is clicked
export const InventoryView = ({ products, onEdit, onClose, onAdd }) => (
    <div className="inventory">
        <h2>Manage Inventory</h2>
        <table className="inventoryTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Brand</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Colour</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {products && products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.description}</td>
                        <td>{product.category}</td>
                        <td>{product.color}</td>
                        <td>{product.size}</td>
                        <td>{product.quantity}</td>
                        <td>${product.price}</td>
                        <td><button onClick={() => onEdit(product)}>Edit</button></td>
                    </tr>
                ))}
                <tr>
                    <td className="adminAdd" colSpan={10}><button type="button" onClick={onAdd}>Add Item</button></td>
                </tr>
            </tbody>
        </table>
        <br />
        <button type="button" onClick={onClose}>Exit</button>
    </div>
);

// element to view user accounts, calls another element to edit when edit button is clicked
export const AccountsView = ({ accounts, onEdit, onClose }) => {
    return (
        <div className="accounts">
            <h2>Manage User Accounts</h2>
            <table className="accountTable">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>User Phone</th>
                        <th>User Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts && accounts.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                            <td><button onClick={() => onEdit(user)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button type="button" onClick={onClose}>Exit</button>
        </div>
    )
};

// view the full information for a single order
export const FullOrderView = ({ order, allOrders, onClose }) => (
    <div>
        <h2>Order Details</h2>
        <p><b>Order ID:</b> {order.orderId}</p>
        <p><b>Total Amount:</b> {order.totalAmount}</p>
        <p><b>Customer Name:</b> {order.firstName} {order.lastName}</p>
        <p><b>Customer Email:</b> {order.email}</p>
        <p><b>Customer Phone:</b> {order.phone}</p>
        <p><b>Customer User ID:</b> {order.userId}</p>
        <p><b>Date Ordered:</b> {new Date(order.dateOfPurchase).toUTCString()}</p>
        <p><b>Billing Address:</b> {order.billingStreet}, {order.billingCity}, {order.billingProvince}, {order.billingPostalCode}, {order.billingCountry}</p>
        <p><b>Shipping Address:</b> {order.shippingStreet}, {order.shippingCity}, {order.shippingProvince}, {order.shippingPostalCode}, {order.shippingCountry}</p>
        <OrderedItems thisOrderId={order.orderId} allOrders={allOrders} onClose={onClose} />
    </div>
);

// view for when admin is editing a user's information
export const EditUserView = ({ user, onClose }) => {
    const [editableUser, setEditableUser] = useState({ ...user });
    const [editComplete, setEditComplete] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (user.role == "admin") {
            setEditComplete(true);
            return;
        }
        try {
            const resp = await submitEditUser(JSON.stringify(editableUser));
            setEditComplete(true);
        } catch (error) {
            console.error('Error updating user: ', error);
        }
    };

    const handleDiscard = () => {
        setEditableUser({ ...user });
    };

    return (
        <div>
            <h2>Edit User Details</h2>
            <br />
            <p><b>ID:</b> {editableUser.userId}</p>
            <form className="adminEdit">
                {editComplete ? (
                    user.role == "admin" ? (
                        <><br /><p>sorry, admins cannot edit admin accounts</p></>
                    ) : (
                        <><br /><p>Successfully updated user.</p></>
                    )
                ) : (
                    <>
                        <AdminEditUser editableUser={editableUser} handleChange={handleChange} />
                        <button type="button" onClick={handleSubmit}>Save Changes</button>
                        <button type="button" onClick={handleDiscard}>Discard Changes</button>
                    </>
                )}
                <button type="button" onClick={onClose}>Exit</button>
            </form>
        </div>
    );
}

// view for when admin is editing a product
export const EditProductView = ({ product, onClose }) => {
    const [editableProduct, setEditableProduct] = useState({ ...product });
    const [editComplete, setEditComplete] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const resp = await submitEdit(JSON.stringify(editableProduct), product.id);
            setEditComplete(true);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // image is handled separately from the other data
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file.size > 1024 * 1024) {
            setImageError("Please upload a 1MB image.");
            return;
        }
        if (!file.type.startsWith("image")) {
            setImageError("Please upload in image");
            return;
        }
        setImageError(null);
        setImageFile(file);
    }

    const handleImageSubmit = async () => {
        if (!imageFile) {
            setImageError("No image file selected");
            return;
        }
        try {
            const resp = await submitImage(imageFile, product.id);
            console.log(resp);
            setEditComplete(true);
        } catch (error) {
            console.error('Error uploading image: ', error);
            setImageError("error uploading image");
        }
    };

    // backend would need to be refactored to allow deleting, foreign key constraints
    // const handleDelete = async () => {
    //     try {
    //         const resp = await deleteItem(product.id);
    //         setDeleted(true);
    //     } catch (error) {
    //         console.error('Error deleting product:', error);
    //     }
    // };

    const handleDiscard = () => {
        setEditableProduct({ ...product });
        setImageFile(null);
    };

    return (
        <div>
            <h2>Edit Product Details</h2>
            {/* <button type="button" className="adminDeleteItem" 
            hidden={deleted} onClick={handleDelete}>DELETE PRODUCT</button> */}
            <br />
            <p><b>ID:</b> {editableProduct.id}</p>
            <form className="adminEdit">
                {editComplete ? (
                    <><br /><p>Successfully updated product.</p></>
                ) : (
                    <>
                        <div className="adminEditFields">

                            <label htmlFor="image"><b>Add Image to Product: </b></label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange} />
                            <button type="button" onClick={handleImageSubmit}>Upload Image</button>
                        </div>
                        {imageError &&
                            <span style={{ color: "red" }}>{imageError}</span>
                        }
                        <hr />

                        <AdminEdit editableProduct={editableProduct} handleChange={handleChange} />
                        <button type="button" onClick={handleSubmit}>Save Changes</button>
                        <button type="button" onClick={handleDiscard}>Discard Changes</button></>
                )}
                <button type="button" onClick={onClose}>Exit</button>
            </form>
        </div>
    );
};

// view for when admin is adding a new item
export const AddItemView = ({ onClose }) => {
    const emptyProduct = {
        brand: "", category: "", color: "", description: "",
        id: "", image: "", name: "", price: "", quantity: "", size: ""
    };
    const [editableProduct, setEditableProduct] = useState(emptyProduct);
    const [editComplete, setEditComplete] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            setImageError("No image file selected");
            return;
        }
        try {
            const createResp = await createItem(JSON.stringify(editableProduct));
            const imgResp = await submitImage(imageFile, createResp.productId);
            setEditComplete(true);
        } catch (error) {
            console.error('Error updating product: ', error);
            setImageError("error uploading image");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file.size > 1024 * 1024) {
            setImageError("Please upload a 1MB image.");
            return;
        }
        if (!file.type.startsWith("image")) {
            setImageError("Please upload in image");
            return;
        }
        setImageError(null);
        setImageFile(file);
    }

    const handleDiscard = () => {
        setEditableProduct(emptyProduct);
    };

    return (
        <div>
            <h2>Add A New Product</h2>
            <br />
            <form className="adminEdit">
                {editComplete ? (
                    <><br /><p>Successfully created item.</p></>
                ) : (
                    <>
                        {/* <div className="adminEditFields">
                            <label htmlFor="ID"><b>ID:</b></label>
                            <input type="text" id="ID" name="id" value={editableProduct.id} onChange={handleChange} />
                        </div> */}

                        <div className="adminEditFields">
                            <label htmlFor="image"><b>Add Image to Product: </b></label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange} />
                        </div>
                        {imageError &&
                            <span style={{ color: "red" }}>{imageError}</span>
                        }
                        <hr />

                        <AdminEdit editableProduct={editableProduct} handleChange={handleChange} />
                        <button type="button" onClick={handleSubmit}>Save Changes</button>
                        <button type="button" onClick={handleDiscard}>Discard Changes</button>
                    </>
                )}

                <button type="button" onClick={onClose}>Exit</button>
            </form>
        </div>
    );
};

// elements called locally, moved out of main function for clarity
// table of ordered items in a single order
const OrderedItems = ({ thisOrderId, allOrders, onClose }) => (
    <div>
        <h3>Items Ordered</h3>
        <table className="salesTable">
            <thead>
                <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Item Brand</th>
                    <th>Item Category</th>
                    <th>Item Price</th>
                    <th>Qty Ordered</th>
                </tr>
            </thead>
            <tbody>
                {allOrders.map((order) => {
                    return (
                        (thisOrderId == order.orderId) ? (
                            <tr key={order.id + order.itemId}>
                                <td>{order.itemId}</td>
                                <td>{order.itemName}</td>
                                <td>{order.itemBrand}</td>
                                <td>{order.itemCategory}</td>
                                <td>{order.itemPrice}</td>
                                <td>{order.itemQuantity}</td>
                            </tr>
                        ) : null
                    );
                })}
            </tbody>
        </table>
        <br />
        <button onClick={onClose}>Close</button>
    </div>
);

// fields for when admin is editing a product or creating a new one
const AdminEdit = ({ editableProduct, handleChange }) => {
    return (
        <><div className="adminEditFields">
            <label htmlFor="name"><b>Name:</b></label>
            <input
                type="text"
                id="name"
                name="name"
                value={editableProduct.name}
                onChange={handleChange} />
        </div><div className="adminEditFields">
                <label htmlFor="brand"><b>Brand:</b></label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={editableProduct.brand}
                    onChange={handleChange} />
            </div><div className="adminEditFields">
                <label htmlFor="description"><b>Description:</b></label>
                <textarea
                    id="description"
                    name="description"
                    value={editableProduct.description}
                    onChange={handleChange} />
            </div><div className="adminEditFields">
                <label htmlFor="category"><b>Category:</b></label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={editableProduct.category}
                    onChange={handleChange} />
            </div><div className="adminEditFields">
                <label htmlFor="color"><b>Colour:</b></label>
                <input
                    type="text"
                    id="color"
                    name="color"
                    value={editableProduct.color}
                    onChange={handleChange} />
            </div><div className="adminEditFields">
                <label htmlFor="size"><b>Size:</b></label>
                <input
                    type="text"
                    id="size"
                    name="size"
                    value={editableProduct.size}
                    onChange={handleChange} />
            </div><div className="adminEditFields">
                <label htmlFor="quantity"><b>Quantity:</b></label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={editableProduct.quantity}
                    onChange={handleChange} />
            </div><div className="adminEditFields">
                <label htmlFor="price"><b>Price:</b></label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={editableProduct.price}
                    onChange={handleChange} />
            </div></>
    )
}

// similar to previous but for editing a user
const AdminEditUser = ({ editableUser, handleChange }) => {
    return (
        <>  <div className="adminEditFields">
            <label htmlFor="firstName"><b>First Name:</b></label>
            <input
                type="text"
                id="firstName"
                name="firstName"
                value={editableUser.firstName}
                onChange={handleChange} />
        </div>
            <div className="adminEditFields">
                <label htmlFor="lastName"><b>Last Name:</b></label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editableUser.lastName}
                    onChange={handleChange} />
            </div>
            <div className="adminEditFields">
                <label htmlFor="phone"><b>Phone:</b></label>
                <input
                    id="phone"
                    name="phone"
                    value={editableUser.phone}
                    onChange={handleChange} />
            </div>
            <div className="adminEditFields">
                <label htmlFor="role"><b>Role:</b></label>
                <input
                    id="role"
                    name="role"
                    value={editableUser.role}
                    onChange={handleChange} />
            </div></>
    )
}