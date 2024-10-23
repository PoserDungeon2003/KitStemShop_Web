import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import _ from "lodash";
import { useMemo } from "react";
import { CartItems } from "~/components";
import { formatMoney } from "~/components/utils";
import { useGetAllCombos, useGetAllItems, useGetCart, useGetOrdersByUserId, useGetProfile } from "~/data";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  return json({}, { status: 200 });
}

export default function Cart() {
  const profile = useGetProfile();
  const cart = useGetCart(profile.data?.user?.token || "");
  const combo = useGetAllCombos();
  const items = useGetAllItems();
  const navigate = useNavigate();

  const mapCombo = useMemo(() => {
    return _.mapKeys(combo.data?.data, it => it.compoId)
  }, [combo.data?.data]);

  const mapItem = useMemo(() => {
    return _.mapKeys(items.data?.data, it => it.istemId)
  }, [items.data?.data]);

  const totalPrice = useMemo(() => {
    return _.sumBy(cart.data?.orderDetailsDTO, (it) => {
      if (it.iStemId == 0) {
        return mapCombo[it.labKitId]?.price;
      } else {
        return mapItem[it.iStemId]?.price;
      }
    });
  }, [cart.data?.orderDetailsDTO]);

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">

        <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">Shopping Cart
        </h2>
        {!cart.data && <h4 className="flex items-center justify-center py-10 text-xl">
          No items in cart
        </h4>}
        {_.map(cart.data?.orderDetailsDTO, (item, index) => {
          return (
            <CartItems
              key={index}
              isCombo={item.labKitId !== 0}
              id={item.iStemId == 0 ? item.labKitId : item.iStemId}
              link={item.iStemId == 0 ? `/combo/${item.labKitId}` : `/item/${item.iStemId}`}
              name={item.iStemId == 0 ? mapCombo[item.labKitId]?.labKitName : mapItem[item.iStemId]?.istemName}
              price={item.iStemId == 0 ? mapCombo[item.labKitId]?.price : mapItem[item.iStemId]?.price}
              image={item.iStemId == 0 ? mapCombo[item.labKitId]?.image : mapItem[item.iStemId]?.img}
              description={item.labKitId != 0 ? mapCombo[item.labKitId]?.labKitDescription : ''}
            />
          )
        })}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between lg:px-6 pb-6 border-b border-gray-200 max-lg:max-w-lg max-lg:mx-auto">
          <h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">Subtotal</h5>

          <div className="flex items-center justify-between gap-5 ">
            <button
              className="rounded-full py-2.5 px-3 bg-indigo-50 text-indigo-600 font-semibold text-xs text-center whitespace-nowrap transition-all duration-500 hover:bg-indigo-100">Promo
              Code?</button>
            <h6 className="font-manrope font-bold text-3xl lead-10 text-indigo-600">{formatMoney(totalPrice || 0)}</h6>
          </div>
        </div>
        <div className="max-lg:max-w-lg max-lg:mx-auto">
          {/* <p className="font-normal text-base leading-7 text-gray-500 text-center mb-5 mt-6">Shipping taxes, and discounts
            calculated
            at checkout</p> */}
          <button
            onClick={() => navigate('/checkout')}
            className="rounded-full border-2 border-primary py-4 px-6 bg-primary text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-transparent hover:text-primary ">
            Checkout
          </button>

        </div>
      </div>
    </section>
  )
}