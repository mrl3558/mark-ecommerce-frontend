import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SalesView, FullOrderView } from './AdminViews';
import { fetchBasicUserInfo, fetchFullUserInfo, updateProfile, updatePassword } from "./services/userService.js";
import { getUserOrders } from "./services/orderService.js";
import { logout } from "./services/authService.js";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [newUserInfo, setNewUserInfo] = useState({});
  const [password, setPassword] = useState("");
  const [updated, setUpdated] = useState(false);
  const [userOrAdmin, setUserOrAdmin] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  const [viewPurchase, setViewPurchase] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [saleHistory, setSaleHistory] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");


  const navigate = useNavigate();

  // fetch info on page load
  const fetchUserInfo = async () => {
    try {
      //first get basic info
      var resp = await fetchBasicUserInfo();
      const id = resp.userId;
      const role = resp.role;
      setUserOrAdmin(!(role == "admin"));

      // then get full info
      resp = await fetchFullUserInfo(id);
      setUserInfo(JSON.parse(JSON.stringify(resp)));
      setNewUserInfo(JSON.parse(JSON.stringify(resp)));
    } catch (error) {
      setLoggedOut(true);
      console.error('Error fetching profile: ', error);
    }
  };

  const doUpdateProfile = async () => {
    newUserInfo.password = password;
    try {
      const resp = await updateProfile(newUserInfo);
      setIsIncorrect(false);
      setUpdated(true);
    } catch (error) {
      console.error('Error updating profile: ', error);
      if (error.status == 401) {
        setIsIncorrect(true);
      }
    }
  };

  useEffect(() => {
    if (updated) {
      setTimeout(() => {
        setUpdated(false);
        cancel();
      }, 2000);
    }
  }, [updated]);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") != "true") {
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } else fetchUserInfo();
  }, [, updated, loggedOut]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserInfo({ ...newUserInfo, [name]: value });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const viewFullOrder = (order) => {
    setViewingOrder(order);
  };

  const goToAdmin = () => {
    navigate("/admin");
  }

  const handleViewPurchase = () => {
    const fetchData = async () => {
      try {
        // Fetch user sale history
        const historyData = await getUserOrders();
        setSaleHistory(historyData);
        setViewPurchase(true);
        console.log(historyData);

      } catch (error) {
        setHidden(false);
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }

  const handleLogout = async () => {
    const resp = await logout();
    localStorage.setItem("isLoggedIn", "false");
    setLoggedOut(true);
  }

  const handleUpdatePassword = () => {
    const doUpdate = async () => {
      try {
        const resp = await updatePassword(password, newPassword);
        setUpdated(true);
      } catch (error) {
        setIsIncorrect(true);
        console.error("Error updating password: ", error);
      }
    };
    doUpdate();
  }

  const cancel = () => {
    if (updatingPassword) {
      setNewPassword("");
      setUpdatingPassword(false);
    } else {
      //reset the new user information json, so that it is consistent if user clicks edit again
      setNewUserInfo(JSON.parse(JSON.stringify(userInfo)));
      toggleEdit();
    }
    setPassword("");
    setIsIncorrect(false);
  };

  return (
    <div>
      {!viewPurchase ? (
        <div className="profile">
          <div className="profileInfo">
            <h2>Profile</h2>
            {isEditing ? (
              <div>
                {!updated && !updatingPassword ? (
                  <>
                    <label>
                      First Name:&nbsp;
                      <br />
                      <input
                        type="text"
                        name="firstName"
                        value={newUserInfo.firstName}
                        onChange={handleInputChange}
                      />
                    </label>
                    <br /><br />
                    <label>
                      Last Name:&nbsp;
                      <br />
                      <input
                        type="text"
                        name="lastName"
                        value={newUserInfo.lastName}
                        onChange={handleInputChange}
                      />
                    </label>
                    <br /><br />
                    <label>
                      Email:&nbsp;
                      <br />
                      <input
                        type="email"
                        name="email"
                        value={newUserInfo.email}
                        onChange={handleInputChange}
                      />
                    </label>
                    <br /><br />
                    <label>
                      Phone Number:&nbsp;
                      <br />
                      <input
                        type="text"
                        name="phone"
                        value={newUserInfo.phone}
                        onChange={handleInputChange}
                      />
                    </label>
                    <br /><br />
                    <label>
                      Please verify password to update information:&nbsp;
                      <br />
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                    <br /><br />
                    <button onClick={doUpdateProfile}>Save</button>
                    <button onClick={cancel}>Cancel</button>
                    {isIncorrect &&
                      <p style={{ color: "red" }}>incorrect password</p>
                    }

                  </>
                ) : (
                  <p>Your information has been updated successfully.</p>
                )}
              </div>
            ) : updatingPassword ? (
              <div>
                {!updated && updatingPassword ? (
                  <div>
                    <label>
                      Current Password:&nbsp;
                      <br />
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                    <br /><br />
                    <label>
                      New Password:&nbsp;
                      <br />
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </label>
                    {isIncorrect &&
                      <p style={{ color: "red"}}>incorrect password</p>
                    }

                    <br /><br />
                    <button onClick={handleUpdatePassword}>Update</button>
                    <button onClick={cancel}>Cancel</button>
                  </div>
                ) : (
                  <p>Your password has been updated successfully.</p>
                )}

              </div>
            ) : (
              <div>
                {localStorage.getItem("isLoggedIn") == "true" ? (
                  <div>
                    {!userOrAdmin &&
                      <div>
                        <p>You're an admin!</p>
                        <button onClick={goToAdmin}>Click To Go To Admin Dashboard</button>
                      </div>
                    }
                    <p>First Name: {userInfo.firstName}</p>
                    <p>Last Name: {userInfo.lastName}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Phone Number: {userInfo.phone}</p>
                    <button onClick={toggleEdit}>Edit Profile</button>

                    <div>
                      <h3>Update Password</h3>
                      <button onClick={(e) => setUpdatingPassword(true)}>Update Password</button>
                    </div>

                    <div className="purchaseHistory">
                      <h3 className="purchaseHistoryLabel">Purchase History</h3>
                      <button onClick={() => handleViewPurchase()}>View Purchase History</button>
                      {!hidden &&
                        <p>You have no previous orders :&#40;</p>
                      }
                    </div>
                    <div className="logout">
                      <h3>Logout</h3>
                      <button onClick={handleLogout}>Logout</button>


                    </div>
                  </div>
                ) : (
                  <>
                    <p>You are not logged in.</p>
                    <p>Redirecting...</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="userHistory">
          {!viewingOrder ? (
            <>
              <h2>Your Purchases</h2>
              <SalesView saleHistory={saleHistory} onViewMore={viewFullOrder}
                onClose={() => { setViewPurchase(false) }} />
            </>
          ) : (
            <FullOrderView order={viewingOrder} allOrders={saleHistory} onClose={() => setViewingOrder(null)} />
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
