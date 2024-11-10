import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import _ from "lodash";
import { useMemo, useState } from "react";
import { FaAngleLeft, FaBagShopping, FaFacebookF, FaInstagram, FaStar, FaTwitter } from "react-icons/fa6";
import { ItemCard, ProductCard } from "~/components";
import { formatMoney } from "~/components/utils";
import { addToCart, ComboLabKitDetail, getComboById, getItemById, Item, useGetAllItems, useGetAllKits, useGetLabById, useGetOrdersByUserId, useGetProfile } from "~/data";

export const handle = {
  breadcrumb: true,
}

type LoaderData = {
  detail: Item,
  slug?: string,
}

export async function loader({ params }: LoaderFunctionArgs) {
  let slug = params.slug;
  try {
    let comboDetail = await getItemById(slug || '');
    let detail = comboDetail?.data;
    if (!detail) return json({ detail: {} }, { status: 404 });
    return json({ detail, slug }, { status: 200 });
  } catch (error) {
    return json({}, { status: 404 });
  }
}

export default function ComboDetail() {
  const profile = useGetProfile();
  const { detail, slug } = useLoaderData<LoaderData>();
  const [quantity, setQuantity] = useState<number>(1);
  const labDetail = useGetLabById(detail.istemId || 0, profile.data?.user?.token || "");
  const items = useGetAllItems();
  const kits = useGetAllKits();
  const isLogin = !!profile.data?.detail?.username;
  const myOrders = useGetOrdersByUserId(profile.data?.user?.token || "");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      let response = await addToCart(profile.data?.user?.token || "", {
        totalPrice: detail.price,
        orderDetailsDTO: [
          {
            labKitId: 0,
            iStemId: Number(slug),
          }
        ]
      });
      if (response) {
        console.log(response);
        queryClient.invalidateQueries({
          queryKey: ['cart']
        })
        message.success("Added to cart successfully")
      }
    } catch (error: any) {
      message.error(`${error?.message}`)
    }
  }

  const getLabById = useMemo(() => {
    return _(myOrders.data?.data)
      .find((it) => it.labId === detail.istemId)
  }, [myOrders.data?.data, detail])

  const filterKitsByComboId = useMemo(() => {
    if (!kits.data?.data) return [];
    return _(kits.data?.data)
      .filter((it) => it.compoId == Number(slug || 0) && it.status === 'Active')
      .value();
  }, [kits.data]);

  const relatedItems = useMemo(() => {
    return _(items.data?.data)
      .filter((it) => _(filterKitsByComboId).some((item) => item.kitId === it.kitId))
      .value();
  }, [items.data, filterKitsByComboId]);

  return (
    <main>
      <div className="container grid grid-cols-2 gap-6">
        <div>
          <img src={detail.img || '/images/products/product2.jpg'} alt={detail.istemName} className="w-full h-full aspect-[612/453]" />
          <div className="grid grid-cols-5 gap-4 mt-4">
            {/* <img src="/images/products/product2.jpg" alt="product2" className="w-full cursor-pointer border border-primary" />
            <img src="/images/products/product3.jpg" alt="product2" className="w-full cursor-pointer border" />
            <img src="/images/products/product4.jpg" alt="product2" className="w-full cursor-pointer border" />
            <img src="/images/products/product5.jpg" alt="product2" className="w-full cursor-pointer border" />
            <img src="/images/products/product6.jpg" alt="product2" className="w-full cursor-pointer border" /> */}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-medium uppercase mb-2">{detail.istemName}</h2>
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-yellow-400">
              {_.map([1, 2, 3, 4, 5], (item, index) => {
                return (
                  <span key={index}><FaStar /></span>
                )
              })}
            </div>
            <div className="text-xs text-gray-500 ml-3">(150 Reviews)</div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Availability:</span>
              <span className="text-green-600">{detail.stock} In Stock</span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">Warranty Months: </span>
              <span className="text-gray-600">{detail.warrantyMonths} months</span>
            </p>
            {/* <p className="space-x-2">
              <span className="text-gray-800 font-semibold">Category: </span>
              <span className="text-gray-600">{detail.categoryName}</span>
            </p> */}
            {/* <p className="space-x-2">
              <span className="text-gray-800 font-semibold">SKU: </span>
              <span className="text-gray-600">BE45VGRT</span>
            </p> */}
          </div>

          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
            <p className="text-xl text-primary font-semibold">{formatMoney(detail.price)}</p>
            <p className="text-base text-gray-400 line-through">{formatMoney(detail.price)}</p>
          </div>

          {/* <p className="mt-4 text-gray-600">
            {detail.labKitDescription}
          </p> */}

          {/* <div className="pt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">Size</h3>
            <div className="flex items-center gap-2">
              <div className="size-selector">
                <input type="radio" name="size" id="size-xs" className="hidden" />
                <label htmlFor="size-xs" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">XS</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-sm" className="hidden" />
                <label htmlFor="size-sm" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">S</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-m" className="hidden" />
                <label htmlFor="size-m" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">M</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-l" className="hidden" />
                <label htmlFor="size-l" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">L</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-xl" className="hidden" />
                <label htmlFor="size-xl" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">XL</label>
              </div>
            </div>
          </div> */}

          {/* <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Color</h3>
            <div className="flex items-center gap-2">
              <div className="color-selector">
                <input type="radio" name="color" id="red" className="hidden" />
                <label htmlFor="red" className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" style={{ backgroundColor: '#fc3d57' }}></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="black" className="hidden" />
                <label htmlFor="black" className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" style={{ backgroundColor: '#000' }}></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="white" className="hidden" />
                <label htmlFor="white" className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" style={{ backgroundColor: '#fff' }}></label>
              </div>
            </div>
          </div> */}

          <div className="mt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
              <div onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }} className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">-</div>
              <div className="h-8 w-8 text-base flex items-center justify-center">{quantity}</div>
              <div onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">+</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
            <div onClick={() => navigate(-1)} className="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition">
              <FaAngleLeft /> Back
            </div>
            <button onClick={handleAddToCart} className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition">
              <FaBagShopping /> Add to cart
            </button>
          </div>

          <div className="flex gap-3 mt-4">
            <a href="#" className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <div className="container pb-16">

      </div>
      {/* <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Items people also buy</h2>
        <div className="grid grid-cols-4 gap-6 w-full max-w-full overflow-y-hidden overflow-x-auto">
          {_.map(relatedItems, (item, index) => {
            return (
              <ItemCard link={`/item/${item.istemId}`} itemId={Number(slug)} key={index} price={item.price} discountPrice={item.price} title={item.istemName} imageUrl={item.img || '/images/combo/1.jpg'} />
            )
          })}
        </div>
      </div> */}
    </main>
  )
}