import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { addToCart } from "./services/cartService.js";
import { fetchProduct, getImage } from "./services/productService.js";
import { fetchReviews, createReview, updateReview, deleteReview } from "./services/reviewService.js";
import { fetchBasicUserInfo } from "./services/userService.js";

function Item() {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [reviews, setReviews] = useState(null);
    const [noStock, SetNoStock] = useState(false);
    const [added, setAdded] = useState(false);
    const [userID, setUserID] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [userReview, setUserReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedReviewText, setEditedReviewText] = useState("");
    const [editedRating, setEditedRating] = useState(5);
    const [reviewUpdated, setReviewUpdated] = useState(false);

    const invokeAdd = () => {
        if (product.quantity < 1) {
            SetNoStock(true);
            setTimeout(() => {
                SetNoStock(false);
            }, 2000);
            return;
        }
        addToCart(product.id);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    // fetch product info, then reviews, then userInfo for id, if logged in
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await fetchProduct(id);
                setProduct(productData);

                const reviewData = await fetchReviews(id);
                setReviews(reviewData);

                if (localStorage.getItem("isLoggedIn") == "true") {
                    const user = await fetchBasicUserInfo(id);
                    setUserID(user.userId);
                }
            } catch (err) {
                console.error('Error fetching product: ', err);
            }
        };
        fetchData();
    }, []);

    // if userID and reviews recieved, then check if user has already made a review for this product
    useEffect(() => {
        if (userID && reviews.length > 0) {
            const reviewExists = reviews.find(review => review.userID == userID);
            // if did make a review, then set the states for the editable portions
            if (reviewExists) {
                setUserReview(reviewExists);
                setEditedReviewText(reviewExists.comment);
                setEditedRating(reviewExists.rating);
            } else {
                setUserReview(false);
            }
        }
    }, [userID, reviews]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const submitReview = async () => {
        if (reviewText) {
            try {
                console.log(id, userID, reviewText, rating);
                await createReview(id, userID, reviewText, rating);
                setReviewText("");
                setRating(5);
                const updatedReviews = await fetchReviews(id);
                setReviews(updatedReviews);
                setReviewUpdated("created");
            } catch (error) {
                console.error('Error submitting review: ', error);
            }
        }
    };

    const submitEditedReview = async () => {
        if (editedReviewText) {
            try {
                await updateReview(userReview.id, editedReviewText, editedRating);
                const updatedReviews = await fetchReviews(id);
                setReviews(updatedReviews);
                setIsEditing(false);
                setReviewUpdated("updated");
            } catch (error) {
                console.error('Error updating review: ', error);
            }
        }
    };

    const submitDeleteReview = async () => {
        if (window.confirm("Are you sure you want to delete your review?")) {
            try {
                await deleteReview(userReview.id);
                const updatedReviews = await fetchReviews(id);
                setReviews(updatedReviews);
                setUserReview(null);
                setIsEditing(false);
                setReviewUpdated("deleted");
            } catch (error) {
                console.error('Error deleting review: ', error);
            }
        }
    };

    useEffect(() => {
        if (reviewUpdated) {
            setTimeout(() => {
                setReviewUpdated(false);
            }, 2000);
        }
    }, [reviewUpdated]);

    return (
        <div className="item">
            {product.image ? (
                <img src={getImage(product)}></img>
            ) : (
                <img src="https://via.placeholder.com/500"></img>
            )}

            <div className="description">
                <h2>{product.name} by {product.brand}</h2>
                <h3>Price: ${product.price}</h3>
                <p>Category: {product.category}</p>
                <p>Colour: {product.color}</p>
                <p>{product.description}</p>
                <p>Quantity Remaining: {product.quantity}</p>
                <button className="addButton" onClick={invokeAdd}>Add to Cart</button>
                {noStock &&
                    <p style={{ color: "red" }}>sorry, product out of stock</p>
                }
                {added &&
                    <p style={{ color: "green" }}>added to cart!</p>
                }
                <p><Link to="/home"> Go back to home </Link></p>
            </div>
            <div className="reviews">
                <h3>Reviews</h3>
                {reviewUpdated && (
                    <p style={{ color: "green" }}>Review successfully {reviewUpdated}</p>
                )}
                {userID && !userReview && (
                    <div className="leaveReview">
                        <textarea className="reviewInput" value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Leave a review!"
                            required />
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`star${star <= rating ? "filled" : "empty"}`}
                                    onClick={() => setRating(star)}>
                                    {star <= rating ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <button onClick={submitReview}>Submit Review</button>
                    </div>
                )}
                {userID && userReview && !isEditing && (
                    <div className="leaveReview">
                        <p><b>Your Review</b></p>
                        <p className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`star${star <= userReview.rating ? "filled" : "empty"}`}>
                                    {star <= userReview.rating ? '★' : '☆'}
                                </span>
                            ))}
                        </p>
                        <p>{userReview.comment}</p>
                        <button onClick={() => setIsEditing(true)}>Edit Review</button>
                    </div>
                )}

                {userID && userReview && isEditing && (
                    <div className="leaveReview editReview">
                        <textarea className="reviewInput" value={editedReviewText}
                            onChange={(e) => setEditedReviewText(e.target.value)}
                            placeholder="Edit your review"
                            required />
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    className={`star${star <= editedRating ? "filled" : "empty"}`}
                                    onClick={() => setEditedRating(star)} >
                                    {star <= editedRating ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <div className="editButtons">
                            <button className="reviewDelete" onClick={submitDeleteReview}>Delete Review</button>
                            <button onClick={submitEditedReview}>Save Changes</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {reviews && reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="singleReview">
                            <p className="reviewDate">{formatDate(review.reviewDate)}</p>
                            <p className="stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className={`star${star <= review.rating ? "filled" : "empty"}`}>
                                        {star <= review.rating ? '★' : '☆'}
                                    </span>
                                ))}
                            </p>
                            <p><b>{review.firstName}</b></p>
                            <p>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet :&#40;</p>
                )}


            </div>
        </div >
    );
}

export default Item