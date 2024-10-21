import { Link } from "@remix-run/react";
import _ from "lodash"
import { FaHeart, FaMagnifyingGlass, FaStar } from "react-icons/fa6"
import { formatMoney } from "./utils";
import { addToCart, useGetProfile } from "~/data";
import { useQueryClient } from "@tanstack/react-query";

type ProductCardProps = {
  title: string;
  price: number;
  discountPrice?: number;
  rating?: number[];
  link?: string;
  imageUrl?: string;
  itemId: number;
}

export const ItemCard = ({
  price,
  title,
  discountPrice,
  rating,
  link,
  imageUrl,
  itemId,
}: ProductCardProps) => {
  const profile = useGetProfile();
  const queryClient = useQueryClient();

  const handleAddToCart = async (price: number, itemId: number) => {
    try {
      let response = await addToCart(profile.data?.user?.token || "", {
        totalPrice: price,
        orderDetailsDTO: [
          {
            labKitId: 0,
            iStemId: itemId,
          }
        ]
      });
      if (response) {
        console.log(response);
        queryClient.invalidateQueries({
          queryKey: ['cart']
        })
      }
    } catch (error) {
      
    }
  }
  return (
    <div className="bg-white shadow rounded overflow-hidden group">
      <div className="relative">
        <img src={imageUrl || '/images/products/product1.jpg'} alt={title} className="w-full h-full aspect-[294/218]" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <Link to={link || '#'}
            className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
            title="view product">
            <FaMagnifyingGlass />
          </Link>
          <a href="#"
            className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
            title="add to wishlist">
            <FaHeart />
          </a>
        </div>
      </div>
      <div className="pt-4 pb-3 px-4">
        <Link to={link || '#'}>
          <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition line-clamp-1">{title}</h4>
        </Link>
        <div className="flex items-baseline mb-1 space-x-2">
          <p className="text-xl text-primary font-semibold">{formatMoney(discountPrice || 0)}</p>
          <p className="text-sm text-gray-400 line-through">{formatMoney(price)}</p>
        </div>
        <div className="flex items-center">
          <div className="flex gap-1 text-sm text-yellow-400">
            {_.map(rating || [1, 2, 3, 4, 5], (item, index) => {
              return (
                <span key={index}><FaStar /></span>
              )
            })}
          </div>
          <div className="text-xs text-gray-500 ml-3">({_.random(1, 150)})</div>
        </div>
      </div>
      <a onClick={() => {
        handleAddToCart(price, itemId)
      }}
        className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">Add to cart
      </a>
    </div>
  )
}