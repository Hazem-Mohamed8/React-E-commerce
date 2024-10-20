import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBars, FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux-toolkit/slices/Cart-slice";
import Card from "../Card";

const NavigationLinks = ({ isAdmin }) => (
  <nav className="text-lg flex flex-col min-[810px]:flex-row min-[810px]:items-center">
    <Link
      to="/"
      className="hover:text-gray-500 md:text-[16px] ml-0 min-[810px]:ml-6 mt-2 min-[810px]:mt-0"
    >
      Home
    </Link>
    <Link
      to="/contact"
      className="hover:text-gray-500 text-[16px] ml-0 min-[810px]:ml-6 mt-2 min-[810px]:mt-0"
    >
      Contact
    </Link>
    <Link
      to="/about"
      className="hover:text-gray-500 text-[16px] ml-0 min-[810px]:ml-6 mt-2 min-[810px]:mt-0"
    >
      About
    </Link>
    <Link
      to="/signup"
      className="hover:text-gray-500 text-[16px] ml-0 min-[810px]:ml-6 mt-2 min-[810px]:mt-0"
    >
      Sign Up
    </Link>
    <Link
      to="/Shop"
      className="hover:text-gray-500 text-[16px] ml-0 min-[810px]:ml-6 mt-2 min-[810px]:mt-0"
    >
      Shop
    </Link>
    {isAdmin && (
      <Link
        to="/add"
        className="hover:text-gray-500 text-[16px] ml-0 min-[810px]:ml-6 mt-2 min-[810px]:mt-0"
      >
        Add product
      </Link>
    )}
  </nav>
);

const Icons = () => (
  <div className="icons flex justify-between gap-2 align-middle mt-4 min-[810px]:mt-0">
    <Link to="/wishlist" className="m-auto">
      <FaRegHeart size={24} />
    </Link>
    <Link to="/cart" className="m-auto">
      <MdOutlineShoppingCart size={24} />
    </Link>
    <Link to="/profile" className="m-auto">
      <CgProfile size={24} />
    </Link>
  </div>
);

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.admin || false;

  const dispatch = useDispatch();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length > 2) {
        setLoading(true);
        fetch(`http://localhost:3000/api/v1/products?search=${search}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((data) => {
            setProducts(data.products || []);
            setLoading(false);
          })
          .catch((error) => {
            setError("Failed to fetch products.");
            setLoading(false);
          });
      } else {
        setProducts([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    if (search.length > 2) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [search, products]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setError(null);
  };

  return (
    <>
      <div className="flex items-center border-b py-4 px-4 md:px-8 bg-white">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="text-2xl font-bold">Exclusive</div>

          {/* Navigation links */}
          <div
            className={`${
              isNavOpen ? "block" : "hidden"
            } min-[810px]:flex flex-col min-[810px]:flex-row min-[810px]:items-center ml-6 min-[810px]:space-x-6 w-full min-[810px]:w-auto mt-4 min-[810px]:mt-0`}
          >
            <NavigationLinks isAdmin={isAdmin} />

            {/* Search input */}
            <div className="flex items-center space-x-4 relative mt-4 min-[810px]:mt-0 w-full min-[810px]:w-auto">
              <input
                type="text"
                aria-label="Search products"
                placeholder="What are you looking for?"
                className="px-4 py-3 rounded-sm bg-neutral-100 focus:outline-none w-full min-[860px]:w-60 text-black text-xs"
                onChange={handleSearch}
                value={search}
                disabled={loading} // Disable during loading
              />
              <button
                className="text-black px-4 absolute text-lg right-0"
                disabled={loading}
              >
                <FaSearch />
              </button>
            </div>

            {/* Icons */}
            <Icons />
          </div>

          {/* Mobile Menu Button */}
          <div className="min-[810px]:hidden">
            <button onClick={toggleNav} className="text-2xl">
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {filteredProducts.length > 0 && (
        <div className="bg-white px-4 py-2 mb-8 flex justify-center items-center">
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {filteredProducts.map((el, idx) => (
              <Card
                key={idx}
                item={el}
                isWishList={false}
                image={el.imageURL}
                numOfLikes={el.numOfLikes}
                title={el.title}
                price={el.price}
                oldPrice={el.price - el.price * 0.2}
                description={el.description}
                subCategory={el.subCategory.name}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
