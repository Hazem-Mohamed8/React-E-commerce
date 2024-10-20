import { useEffect } from "react";
// import { IoIosPhonePortrait } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux-toolkit/slices/categoriesReducer";
import { Link } from "react-router-dom";

function Categories() {
  const categories = useSelector((state) => state.categories);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className="Categories mt-[40px] mb-[05%] border-b-2 pb-10">
      <div className="banner  p-4 mb-10 my-auto">
        <h1 className="text-[#db4444] font-bold text-[20px]">Categories </h1>
      </div>
      <div className="header">
        <h1 className="font-bold text-[25px] md:text-[40px] ml-[10%] ">
          Browse By Category
        </h1>
      </div>
      <div className="categories-cont flex justify-center gap-10 flex-wrap mt-5 mb-10">
        {categories.slice(2, 8).map((category, index) => (
          <div
            key={index}
            className={`hover:bg-[#db4444] hover:text-white h-40 w-40 category-box border-2 p-10 rounded-md  flex flex-col items-center justify-center 
                        ${
                          category.selected
                            ? "bg-red-500 text-white"
                            : "bg-white text-black"
                        } transition duration-300`}
          >
            <h1 className="md:text-[20px] font-semibold">
              {" "}
              <Link to={`/Shop/${category.name}`}>{category.name}</Link>
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Categories;
