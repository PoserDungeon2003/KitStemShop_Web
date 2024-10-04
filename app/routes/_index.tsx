import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import _ from "lodash";
import { useMemo } from "react";
import { ProductCard } from "~/components";
import { useGetAllCombos, useGetAllKits } from "~/data";

export async function loader({ request }: LoaderFunctionArgs) {
  // let user = await authenticator.isAuthenticated(request);
  // console.log('user', user);

  // if (!user) {
  //   return redirect("/login");
  // }
  return json({}, { status: 200 });
}

const categories = [
  {
    title: 'Bedroom',
    image: '/images/category/category-1.jpg',
    to: '#',
  },
  {
    title: 'Mattrass',
    image: '/images/category/category-2.jpg',
    to: '#',
  },
  {
    title: 'Outdoor',
    image: '/images/category/category-3.jpg',
    to: '#',
  },
  {
    title: 'Sofa',
    image: '/images/category/category-4.jpg',
    to: '#',
  },
  {
    title: 'Living Room',
    image: '/images/category/category-5.jpg',
    to: '#',
  },
  {
    title: 'Kitchen',
    image: '/images/category/category-6.jpg',
    to: '#',
  }
];

export default function Index() {
  const kits = useGetAllKits();
  const combos = useGetAllCombos();

  const filterKits = useMemo(() => {
    return _(kits.data?.data)
      .shuffle()
      .slice(0, 4)
      .value();
  }, [kits.data?.data]);

  const topNewArrivalCombos = useMemo(() => {
    return _(combos.data?.data)
      .shuffle()
      .slice(0, 4)
      .value();
  }, [combos.data?.data]);

  const recommendedCombos = useMemo(() => {
    return _(combos.data?.data)
      .shuffle()
      .slice(0, 8)
      .value();
  }, [combos.data?.data]);

  return (
    <main>
      {/* Banner */}
      <div className="bg-cover bg-no-repeat bg-center py-36" style={{ backgroundImage: "url('/images/banner-bg.jpg')" }
      }>
        <div className="container">
          <h1 className="text-6xl text-gray-800 font-medium mb-4 capitalize">
            best collection for <br /> home decoration
          </h1>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam <br />
            accusantium perspiciatis, sapiente
            magni eos dolorum ex quos dolores odio</p>
          <div className="mt-12">
            <a href="#" className="bg-primary border border-primary text-white px-8 py-3 font-medium 
                rounded-md hover:bg-transparent hover:text-primary">Shop Now</a>
          </div>
        </div>
      </div>
      {/* Features */}
      <div className="container py-16">
        <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
          <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
            <img src="/images/icons/delivery-van.svg" alt="Delivery" className="w-12 h-12 object-contain" />
            <div>
              <h4 className="font-medium capitalize text-lg">Free Shipping</h4>
              <p className="text-gray-500 text-sm">Order over $200</p>
            </div>
          </div>
          <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
            <img src="/images/icons/money-back.svg" alt="Delivery" className="w-12 h-12 object-contain" />
            <div>
              <h4 className="font-medium capitalize text-lg">Money Returns</h4>
              <p className="text-gray-500 text-sm">30 days money returns</p>
            </div>
          </div>
          <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
            <img src="/images/icons/service-hours.svg" alt="Delivery" className="w-12 h-12 object-contain" />
            <div>
              <h4 className="font-medium capitalize text-lg">24/7 Support</h4>
              <p className="text-gray-500 text-sm">Customer support</p>
            </div>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="container py-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">shop by category</h2>
        <div className="grid grid-cols-3 gap-3">
          {_.map(categories, (category, index) => (
            <div key={index} className="relative rounded-sm overflow-hidden group">
              <img src={category.image} alt="category 1" className="w-full" />
              <Link to={category.to}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
                {category.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* New Arrival Section */}
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Top New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {_.map(topNewArrivalCombos, (combo, index) => (
            <ProductCard imageUrl={combo.image} link={`/combo/${combo.compoId}`} price={combo.price} discountPrice={combo.price} title={combo.labKitName} key={index} />
          ))}
          {/* Repeat for other products with adjusted image paths and product details */}
        </div>
      </div>

      {/* Ads Section */}
      <div className="container pb-16">
        <a href="#">
          <img src="/images/offer.jpg" alt="ads" className="w-full" />
        </a>
      </div>

      {/* Product */}
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Recomended for you
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {_.map(recommendedCombos, (combo, index) => (
            <ProductCard imageUrl={combo.image} link={`/combo/${combo.compoId}`} price={combo.price} discountPrice={combo.price} title={combo.labKitName} key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
