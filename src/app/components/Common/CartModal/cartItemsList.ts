// mock data for cart in HeaderTopRight
// const setCartItem = useCartStore((state) => state.setCartItem);

// useEffect(() => {
//   setCartItem(
//     Array.from({ length: 120 }).map((_, i) => ({
//       id: i,
//       name: `Product ${i}`,
//       description: "Mock product",
//       stock: 5,
//       price: 10,
//       discount: 0,
//       rating: null,
//       image: JSON.stringify("['https://picsum.photos/200', 'https://picsum.photos/199']"),
//       createdAt: new Date().toISOString(),
//       priceAfterDis: 10,
//       categoryName: "Mock" as any,
//     }))
//   );
// }, [setCartItem]);

const cartItemsList = [
  {
    id: 1,
    imgs: '',
    title: 'Laptop sieu manh',
    discountedPrice: 100,
  },
  {
    id: 2,
    imgs: '',
    title: 'Laptop sieu manh',
    discountedPrice: 100,
  },
  {
    id: 3,
    imgs: '',
    title: 'Laptop sieu manh',
    discountedPrice: 100,
  },
];
export default cartItemsList;
