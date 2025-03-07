import React, { useState, useEffect } from 'react';
import { SalesView, InventoryView, AccountsView, FullOrderView, 
    EditProductView, EditUserView, AddItemView } from './AdminViews';
import { getAllUsers, getSaleHistory } from './services/adminService.js';
import { fetchProducts } from './services/productService.js';

function Admin() {
    
    const [saleHistory, setSaleHistory] = useState(null);
    const [products, setProducts] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [currentElement, setElement] = useState(null);
    const [addItem, setAddItem] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sale history
                const historyData = await getSaleHistory();
                setSaleHistory(historyData);

                // Fetch all products
                const productsData = await fetchProducts();
                setProducts(productsData);

                // fetch all users
                const allUsers = await getAllUsers();
                setAccounts(allUsers);

            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, [, editingProduct, editingUser, addItem]);

    const viewFullOrder = (order) => {
        setViewingOrder(order);
    };

    const viewEdit = (product) => {
        setEditingProduct(product);
    };

    const viewEditUser = (user) => {
        setEditingUser(user);
    };

    // set the view based on the button clicked. Nested views are contained with
    // variables viewingOrder, editingProduct, addItem
    return (
        <div className="admin">
            {currentElement == "SalesView" ? (
                <div>
                    {!viewingOrder ? (
                        <><h2>Manage Sales History</h2>
                            <SalesView saleHistory={saleHistory} onViewMore={viewFullOrder}
                                onClose={() => setElement(null)} />
                        </>
                    ) : (
                        <FullOrderView order={viewingOrder} allOrders={saleHistory}
                            onClose={() => setViewingOrder(null)} />
                    )}
                </div>
            ) : currentElement == "InventoryView" ? (
                <div>
                    {!editingProduct ? (
                        !addItem ? (
                            <InventoryView
                                products={products} onEdit={viewEdit} onClose={() => setElement(null)}
                                onAdd={() => setAddItem(true)} />
                        ) : (
                            <AddItemView
                                products={products} onEdit={viewEdit} onClose={() => setAddItem(false)}
                            />
                        )
                    ) : (
                        <EditProductView product={editingProduct} onClose={() => setEditingProduct(null)} />
                    )}
                </div>
            ) : currentElement == "AccountsView" ? (
                <div>
                    {!editingUser ? (
                        <AccountsView accounts={accounts} onEdit={viewEditUser}
                            onClose={() => setElement(null)} />
                    ) : (
                        <EditUserView user={editingUser} onClose={() => setEditingUser(null)} />
                    )}
                </div>
            ) : (
                <div>
                    <button className="adminButton" onClick={() => setElement("SalesView")}>Manage Sales History</button>
                    <button className="adminButton" onClick={() => setElement("InventoryView")}>Manage Inventory</button>
                    <button className="adminButton" onClick={() => setElement("AccountsView")}>Manage Accounts</button>
                </div>
            )}
        </div>
    );
}

export default Admin