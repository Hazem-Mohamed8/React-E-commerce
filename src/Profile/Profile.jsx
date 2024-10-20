import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();

  // Get userInfo from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Initialize the state using userInfo from the Redux store
  const [user, setUser] = useState({
    email: userInfo?.email || "", // Default to empty if userInfo is not available
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    displayName: `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`,
  });

  // Use effect to update the user state when userInfo changes (e.g., after loading from an API)
  useEffect(() => {
    if (userInfo) {
      setUser({
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        displayName: `${userInfo.firstName} ${userInfo.lastName}`,
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the update action (Make sure the updateUser action is properly defined)
    dispatch(updateUser(user));
    console.log("User information updated:", user);
  };

  return (
    <div className="profile">
      <h1 className="ml-4 md:ml-10">Home / My Account</h1>

      <div className="flex flex-col md:flex-row p-4 md:p-10">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 md:pr-10 mb-6 md:mb-0">
          <h2 className="font-semibold text-lg mb-4">Manage My Account</h2>
          <ul className="space-y-4">
            <li className="text-red-500 font-bold">My Profile</li>
            <li className="hover:text-red-500">
              <Link to={"/Cart"}>My Cart</Link>
            </li>
            <li className="hover:text-red-500">
              <Link to={"/Wishlist"}>My Wishlist</Link>
            </li>
          </ul>
        </aside>

        {/* Profile Form */}
        <main className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            Edit Your Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Save Changes
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Profile;
