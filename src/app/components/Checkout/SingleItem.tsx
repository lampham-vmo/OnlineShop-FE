export interface CartItem {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  img: string;
}

interface ISingleItemProps {
  item: CartItem;
}

const SingleItem = ({ item }: ISingleItemProps) => {
  return (
    <>
      <div className="flex items-center border-t border-gray-3 py-5 px-7.5">
        <div className="min-w-[450px]">
          <div className="flex items-center justify-between gap-5">
            <div className="w-full flex items-center gap-5.5">
              <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
                <img width={200} height={200} src={item.img} alt="product" />
              </div>

              <div>
                <h3 className="text-dark">{item.title}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-[180px]">
          <p className="text-dark">${item.discountedPrice.toLocaleString()}</p>
        </div>

        <div className="min-w-[275px]">
          <span className="flex items-center justify-center w-16 h-11.5">
            {item.quantity}
          </span>
        </div>

        <div className="min-w-[200px]">
          <p className="text-dark">
            ${(item.discountedPrice * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleItem;
