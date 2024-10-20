import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import {
  decPage,
  fetchProducts,
  incPage,
} from "../redux-toolkit/slices/productReducer";
import { getCategories } from "../redux-toolkit/slices/categoriesReducer";
import { useParams } from "react-router-dom";

const Shop = () => {
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories);
  const page = useSelector((state) => state.products.page); // Get current page from state
  const dispatch = useDispatch();

  let params = useParams();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");

  // Fetch products and categories initially
  useEffect(() => {
    dispatch(fetchProducts(page));
    dispatch(getCategories());
  }, [dispatch, page]);

  // Handle filtering and sorting when products, selectedCategory, or sortOption changes
  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortOption]);

  // Fetch all products when category is set to "All"
  useEffect(() => {
    if (selectedCategory === "All") {
      dispatch(fetchProducts(page)); // Fetch all products
    }
  }, [selectedCategory, dispatch, page]);

  const filterAndSortProducts = () => {
    let updatedProducts = [...products];

    // Filter by selected category
    if (selectedCategory && selectedCategory !== "All") {
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory.name === selectedCategory
      );
    }

    // Filter by category in params
    if (params.category && params.category.trim() !== "") {
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory.name === params.category
      );
    }

    // Sorting options
    switch (sortOption) {
      case "priceLowToHigh":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "aToZ":
        updatedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "zToA":
        updatedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "reviews":
        updatedProducts.sort((a, b) => b.rating.count - a.rating.count);
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    if (selectedCategory === "All") {
      dispatch(fetchProducts(page)); // Fetch all products
    }
  }, [selectedCategory, dispatch, page]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // When "All" is selected, fetch all products
    if (category === "All") {
      dispatch(fetchProducts(page));
    }
  };

  return (
    <div className="text-start md:w-[90%] m-auto p-2 md:p-0 my-[2rem]">
      <p className="md:ps-2 font-bold text-2xl">Shop</p>
      <div className="flex my-5 md:ps-2 justify-between md:flex-row flex-col gap-3">
        {/* Sort Products */}
        <div className="flex items-center gap-3">
          <p>Filter:</p>
          <select
            onChange={(e) => setSortOption(e.target.value)}
            placeholder="Sort By"
          >
            <option value="">Select Sort Option</option>
            <option value="priceLowToHigh">Price low to high</option>
            <option value="priceHighToLow">Price high to low</option>
            <option value="aToZ">Alphabetically A to Z</option>
            <option value="zToA">Alphabetically Z to A</option>
            <option value="reviews">Reviews</option>
          </select>
        </div>

        {/* Filter by Category */}
        <div>
          <select
            onChange={handleCategoryChange} // Updated to use the new function
            placeholder="Category"
          >
            <option value="All">All Categories</option>
            {categories.map((el) => (
              <option key={el._id} value={el.name}>
                {el.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
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

      <div className="flex justify-between items-center my-8">
        <button
          className="bg-red-500 text-white p-2"
          onClick={() => dispatch(decPage())}
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          className="bg-red-500 text-white p-2"
          onClick={() => dispatch(incPage())}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Shop;
