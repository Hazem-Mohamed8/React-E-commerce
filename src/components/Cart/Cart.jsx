import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, GetCart } from "../../redux-toolkit/slices/Cart-slice";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetCart());
  }, [dispatch]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const fetchedProducts = await Promise.all(
        cartItems.map(async (item) => {
          const response = await fetch(
            `http://localhost:3000/api/v1/products/${item.product}`
          );
          const data = await response.json();
          console.log(data);

          return data;
        })
      );
      setProducts(fetchedProducts);
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems]);

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="overflow-x-auto h-[50vh]">
          <Table>
            <Table.Head>
              <Table.HeadCell>Product image</Table.HeadCell>
              <Table.HeadCell>Product name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {products.map((product) => (
                <Table.Row
                  key={product._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <img
                      src={product.imageURL}
                      alt={product.title}
                      className="w-20 h-20 object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.title}
                  </Table.Cell>
                  <Table.Cell>{product.subCategory?.name}</Table.Cell>
                  <Table.Cell>${product.price}</Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(product._id));
                        dispatch(GetCart());
                      }}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="text-center p-4">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </p>
        </div>
      )}
    </>
  );
}
