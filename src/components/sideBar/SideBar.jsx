import { useEffect } from "react";
import "./sidebar.css";
import { Carousel } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux-toolkit/slices/categoriesReducer";
import { Link, useParams } from "react-router-dom";
import home from "../../assets/home.jpg";

function SideBar() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  return (
    <div className="all">
      <div className="SideBar font-bold text-[15px] align-middle text-center border-r-4 md:h-[50vh] flex-col justify-center list-none">
        {categories.map((el, idx) => {
          return (
            <li key={idx} className="mt-[10px] side-li cursor-pointer">
              <Link to={`/Shop/${el.name}`}>{el.name}</Link>
            </li>
          );
        })}
      </div>
      <div className="crousel bg-black h-56 sm:h-64 xl:h-80 2xl:h-96 md:mt-8 xs:mt-3 ">
        <Carousel>
          <img src={home} alt="..." />
          <img src={home} alt="..." />
          <img src={home} alt="..." />
          <img src={home} alt="..." />
          <img src={home} alt="..." />
        </Carousel>
      </div>
    </div>
  );
}
export default SideBar;
