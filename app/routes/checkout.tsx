import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import _ from "lodash";
import { useMemo } from "react";
import { formatMoney } from "~/components/utils";
import { createOrder, createVnpayPayment, useGetAllCombos, useGetAllItems, useGetCart, useGetProfile } from "~/data";
import { authenticator } from "~/services/auth.server";

export const handle = {
  breadcrumb: true,
}

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  return json({}, { status: 200 });
}


export default function Checkout() {
  const profile = useGetProfile();
  const splitAddress = _.split(profile.data?.user?.address, ', ');
  const cart = useGetCart(profile.data?.user?.token || "");
  const combo = useGetAllCombos();
  const items = useGetAllItems();

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

  const handleCheckout = async () => {
    try {
      let response = await createOrder(profile.data?.user?.token || "", {
        orderDetailsDTO: cart.data?.orderDetailsDTO || [],
        statusPayment: "VnPay",
        labId: 1, // sửa lại sau
      });

      if (response.data.orderId) {
        let vnPayResponse = await createVnpayPayment(profile.data?.user?.token || "", response.data.orderId)
        if (vnPayResponse) {
          window.location.href = vnPayResponse.data;
        }
      }
    } catch (error) {

    }
  }

  return (
    <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">

      <div className="col-span-8 border border-gray-200 p-4 rounded">
        <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="text-gray-600">Full name <span className="text-primary">*</span></label>
            <input defaultValue={profile.data?.user?.fullName} type="text" name="company" id="company" className="input-box" />
          </div>
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="text-gray-600">
                First Name <span className="text-primary">*</span>
              </label>
              <input type="text" name="first-name" id="first-name" className="input-box" />
            </div>
            <div>
              <label htmlFor="last-name" className="text-gray-600">
                Last Name <span className="text-primary">*</span>
              </label>
              <input type="text" name="last-name" id="last-name" className="input-box" />
            </div>
          </div>
          <div>
            <label htmlFor="company" className="text-gray-600">Company</label>
            <input type="text" name="company" id="company" className="input-box" />
          </div> */}
          {/* <div>
            <label htmlFor="region" className="text-gray-600">Country/Region</label>
            <input type="text" name="region" id="region" className="input-box" />
          </div> */}
          <div>
            <label htmlFor="phone" className="text-gray-600">Phone number</label>
            <input defaultValue={profile.data?.user?.phone} type="text" name="phone" id="phone" className="input-box" />
          </div>
          <div>
            <label htmlFor="email" className="text-gray-600">Email address</label>
            <input defaultValue={profile.data?.user?.email} type="email" name="email" id="email" className="input-box" />
          </div>
          <div>
            <label htmlFor="address" className="text-gray-600">Street address</label>
            <input defaultValue={splitAddress[0]} type="text" name="address" id="address" className="input-box" />
          </div>
          <div>
            <label htmlFor="company" className="text-gray-600">Ward</label>
            <input defaultValue={splitAddress[1]} type="text" name="company" id="company" className="input-box" />
          </div>
          <div>
            <label htmlFor="company" className="text-gray-600">District</label>
            <input defaultValue={splitAddress[2]} type="text" name="company" id="company" className="input-box" />
          </div>
          <div>
            <label htmlFor="city" className="text-gray-600">City</label>
            <input defaultValue={splitAddress[3]} type="text" name="city" id="city" className="input-box" />
          </div>
        </div>
      </div>

      <div className="col-span-4 border border-gray-200 p-4 rounded">
        <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">Order Summary</h4>
        <div className="space-y-2">
          {_.map(cart.data?.orderDetailsDTO, (it, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <h5 className="text-gray-800 font-medium">{it.iStemId != 0 ? mapItem[it.iStemId]?.istemName : mapCombo[it.labKitId]?.labKitName}</h5>
                {/* <p className="text-sm text-gray-600">Size: M</p> */}
              </div>
              <p className="text-gray-600">x1</p>
              <p className="text-gray-800 font-medium">{formatMoney(it.iStemId != 0 ? mapItem[it.iStemId].price : mapCombo[it.labKitId].price)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
          <p>Subtotal</p>
          <p>{formatMoney(totalPrice)}</p>
        </div>

        <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
          <p>Shipping</p>
          <p>Free</p>
        </div>

        <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
          <p className="font-semibold">Total</p>
          <p>{formatMoney(totalPrice)}</p>
        </div>

        <div className="flex items-center mb-4 mt-2">
          <input required type="checkbox" name="agreement" id="agreement" className="text-primary focus:ring-0 rounded-sm cursor-pointer w-3 h-3" />
          <label htmlFor="agreement" className="text-gray-600 ml-3 cursor-pointer text-sm">
            I agree to the <a href="#" className="text-primary">terms & conditions</a>
          </label>
        </div>

        <button onClick={handleCheckout} className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium">
          Place order
        </button>
      </div>

    </div>

  )
}