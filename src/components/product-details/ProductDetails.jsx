import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../../redux-toolkit/slices/Cart-slice";
import { addToWishlist } from "../../redux-toolkit/slices/wishlistSlice";

export default function ProductDetails() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [starsList, setStarsList] = useState([]);
  const params = useParams();
  let id = params.id;
  console.log(id);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      });
  }, [id]);
  console.log(product);

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            {/* // Product Images */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <img
                src={product.imageURL}
                alt="Product"
                className="w-full h-auto rounded-lg shadow-md mb-4"
                id="mainImage"
              />
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                <img
                  src={product.imageURL}
                  alt="Thumbnail 1"
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => {}}
                />
                <img
                  src={product.imageURL}
                  alt="Thumbnail 2"
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => {}}
                />
                <img
                  src={product.imageURL}
                  alt="Thumbnail 3"
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => {}}
                />
                <img
                  src={product.imageURL}
                  alt="Thumbnail 4"
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => {}}
                />
              </div>
            </div>

            {/* <!-- Product Details --> */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
              <br></br>
              <div className="mb-4">
                <span className="text-2xl font-bold mr-2">
                  ${Math.round(product.price - product.price / 5)}
                </span>
                <span className="text-gray-500 line-through">
                  ${product.price}
                </span>
              </div>
              <div className="flex items-center mb-4">
                {[2, 3, 4, 5, 6].map((el) => {
                  return (
                    <svg
                      key={el.id}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-yellow-300"
                    >
                      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
                    </svg>
                  );
                }, [])}
                <span className="ml-2 text-gray-600">
                  ({product._id ? product.numOfLikes : 0} reviews)
                </span>
              </div>
              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6 md:mt-[15%]">
                <h3 className="text-lg font-semibold mb-2">Color:</h3>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-black rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"></button>
                  <button className="w-8 h-8 bg-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"></button>
                  <button className="w-8 h-8 bg-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"></button>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity:
                </label>
                {/* <input type="number" id="quantity" name="quantity" min="1" value="1"
                        className="w-12 text-center rounded-md border-gray-300  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"  >
        */}
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="bg-red-500 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => addToWishlist(product)}
                  className="bg-gray-200 flex gap-2 items-center  text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
