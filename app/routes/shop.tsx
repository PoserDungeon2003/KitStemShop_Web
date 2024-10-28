import _ from "lodash";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { FaGripVertical, FaList } from "react-icons/fa6";
import { Pagination } from "antd";
import { ItemCard, ProductCard } from "~/components";
import { useGetAllCombos, useGetAllItems, useGetAllKits } from "~/data";
import { useLocation } from "@remix-run/react";

export const handle = {
  breadcrumb: true,
}

export default function Shop() {
  const items = useGetAllItems();
  const combos = useGetAllCombos();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOption, setSortOption] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const categoryComboId = searchParams.get("categoryComboId");
  const search = searchParams.get("search");
  const [categoryState, setCategoryState] = useState<string>(category || "combo");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const categories = [
    {
      name: "Item",
      value: "item",
      quantity: items.data?.data?.length,
    },
    {
      name: "Combo Kit & Lab",
      value: "combo",
      quantity: combos.data?.data?.length,
    },
  ];

  const handleChange = (pageNumber: number, pageSize: number) => {
    setPage(pageNumber);
    setPageSize(pageSize);
    console.log(`Page changed to: ${pageNumber}, size: ${pageSize}`);
  };

  const handleSortChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSortOption(event.target.value);
    setPage(1);
  };

  const sortedComboData = useMemo(() => {
    if (!combos.data?.data) return [];

    let filteredData = [...combos.data.data];

    if (categoryComboId) {
      filteredData = _(filteredData)
        .filter((combo) => combo.categoryCompoId === Number(categoryComboId))
        .value();
    }

    if (minPrice) {
      filteredData = _(filteredData)
        .filter(combo => combo.price >= minPrice)
        .value();
    }
    else if (maxPrice) {
      filteredData = _(filteredData)
        .filter(combo => combo.price <= maxPrice)
        .value();
    }
    else if (minPrice && maxPrice) {
      filteredData = _(filteredData)
        .filter(combo => combo.price >= minPrice && combo.price <= maxPrice)
        .value();
    }

    if (search && search.length > 0) {
      filteredData = _(filteredData)
        .filter(combo => combo.labKitName.toLowerCase().trim().includes(search.toLowerCase()))
        .value();
    }

    switch (sortOption) {
      case "price-low-to-high":
        filteredData = _(filteredData).orderBy("price", "asc").value();
        break;
      case "price-high-to-low":
        filteredData = _(filteredData).orderBy("price", "desc").value();
        break;
      case "latest":
        filteredData = _(filteredData).orderBy("createdAt", "desc").value();
        break;
      default:
        break;
    }

    return filteredData;
  }, [combos.data?.data, sortOption, categoryComboId, minPrice, maxPrice, search]);

  const comboData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return _(sortedComboData)
      .take(pageSize)
      .value();
  }, [sortedComboData, page, pageSize, categoryState]);

  const sortedItemData = useMemo(() => {
    if (!items.data?.data) return [];

    let filteredData = [...items.data?.data];

    if (minPrice) {
      filteredData = _(filteredData)
        .filter(item => item.price >= minPrice)
        .value();
    }
    else if (maxPrice) {
      filteredData = _(filteredData)
        .filter(item => item.price <= maxPrice)
        .value();
    }
    else if (minPrice && maxPrice) {
      filteredData = _(filteredData)
        .filter(item => item.price >= minPrice && item.price <= maxPrice)
        .value();
    }

    if (search && search.length > 0) {
      filteredData = _(filteredData)
        .filter(item => item.istemName.toLowerCase().trim().includes(search.toLowerCase()))
        .value();
    }

    switch (sortOption) {
      case "price-low-to-high":
        filteredData = _(filteredData).orderBy("price", "asc").value();
        break;
      case "price-high-to-low":
        filteredData = _(filteredData).orderBy("price", "desc").value();
        break;
      case "latest":
        filteredData = _(filteredData).orderBy("createdAt", "desc").value();
        break;
      default:
        break;
    }

    return filteredData;
  }, [items.data?.data, sortOption, categoryState, maxPrice, minPrice, search]);

  const itemsData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return _(sortedItemData)
      .take(pageSize)
      .value();
  }, [sortedComboData, page, pageSize]);

  useEffect(() => {
    if (category) {
      setCategoryState(category);
    }
  }, [category])

  return (
    <main className="container grid md:grid-cols-4 grid-cols-2 gap-6 pt-4 pb-16 items-start">
      {/* Sidebar */}
      {/* Drawer init and toggle */}
      <div className="text-center md:hidden">
        <button
          className="text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block md:hidden"
          type="button"
          data-drawer-target="drawer-example"
          data-drawer-show="drawer-example"
          aria-controls="drawer-example"
        >
        </button>
      </div>

      {/* Drawer component */}
      <div
        id="drawer-example"
        className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800"
        tabIndex={-1}
        aria-labelledby="drawer-label"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            className="w-5 h-5 mr-2"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          Info
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-example"
          aria-controls="drawer-example"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>

        <div className="divide-y divide-gray-200 space-y-5">
          {/* Categories */}
          <div>
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="cat-1"
                  id="cat-1"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="cat-1" className="text-gray-600 ml-3 cursor-pointer">
                  Bedroom
                </label>
                <div className="ml-auto text-gray-600 text-sm">(15)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="cat-2"
                  id="cat-2"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="cat-2" className="text-gray-600 ml-3 cursor-pointer">
                  Sofa
                </label>
                <div className="ml-auto text-gray-600 text-sm">(9)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="cat-3"
                  id="cat-3"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="cat-3" className="text-gray-600 ml-3 cursor-pointer">
                  Office
                </label>
                <div className="ml-auto text-gray-600 text-sm">(21)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="cat-4"
                  id="cat-4"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="cat-4" className="text-gray-600 ml-3 cursor-pointer">
                  Outdoor
                </label>
                <div className="ml-auto text-gray-600 text-sm">(10)</div>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Brands</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="brand-1"
                  id="brand-1"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="brand-1" className="text-gray-600 ml-3 cursor-pointer">
                  Cooking Color
                </label>
                <div className="ml-auto text-gray-600 text-sm">(15)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="brand-2"
                  id="brand-2"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="brand-2" className="text-gray-600 ml-3 cursor-pointer">
                  Magniflex
                </label>
                <div className="ml-auto text-gray-600 text-sm">(9)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="brand-3"
                  id="brand-3"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="brand-3" className="text-gray-600 ml-3 cursor-pointer">
                  Ashley
                </label>
                <div className="ml-auto text-gray-600 text-sm">(21)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="brand-4"
                  id="brand-4"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="brand-4" className="text-gray-600 ml-3 cursor-pointer">
                  M&D
                </label>
                <div className="ml-auto text-gray-600 text-sm">(10)</div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="brand-5"
                  id="brand-5"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="brand-5" className="text-gray-600 ml-3 cursor-pointer">
                  Olympic
                </label>
                <div className="ml-auto text-gray-600 text-sm">(10)</div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Price</h3>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                name="min"
                id="min"
                className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                placeholder="min"
              />
              <span className="mx-3 text-gray-500">-</span>
              <input
                type="text"
                name="max"
                id="max"
                className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                placeholder="max"
              />
            </div>
          </div>

          {/* Size */}
          {/* <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Size</h3>
            <div className="flex items-center gap-2">
              <div className="size-selector">
                <input type="radio" name="size" id="size-xs" className="hidden" />
                <label
                  htmlFor="size-xs"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  XS
                </label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-sm" className="hidden" />
                <label
                  htmlFor="size-sm"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  SM
                </label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-m" className="hidden" />
                <label
                  htmlFor="size-m"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  M
                </label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-l" className="hidden" />
                <label
                  htmlFor="size-l"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  L
                </label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-xl" className="hidden" />
                <label
                  htmlFor="size-xl"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  XL
                </label>
              </div>
            </div>
          </div> */}

          {/* Colors */}
          <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Color</h3>
            <div className="flex items-center gap-2">
              <div className="color-selector">
                <input type="radio" name="color" id="color-red" className="hidden" />
                <label
                  htmlFor="color-red"
                  className="block h-6 w-6 border border-gray-200 rounded-sm cursor-pointer shadow-sm bg-red-600"
                />
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="color-white" className="hidden" />
                <label
                  htmlFor="color-white"
                  className="block h-6 w-6 border border-gray-200 rounded-sm cursor-pointer shadow-sm bg-white"
                ></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="color-black" className="hidden" />
                <label
                  htmlFor="color-black"
                  className="block h-6 w-6 border border-gray-200 rounded-sm cursor-pointer shadow-sm bg-black"
                ></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="color-yellow" className="hidden" />
                <label
                  htmlFor="color-yellow"
                  className="block h-6 w-6 border border-gray-200 rounded-sm cursor-pointer shadow-sm bg-yellow-400"
                ></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="color-blue" className="hidden" />
                <label
                  htmlFor="color-blue"
                  className="block h-6 w-6 border border-gray-200 rounded-sm cursor-pointer shadow-sm bg-blue-600"
                ></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="color-green" className="hidden" />
                <label
                  htmlFor="color-green"
                  className="block h-6 w-6 border border-gray-200 rounded-sm cursor-pointer shadow-sm bg-green-600"
                ></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Visible on large screens) */}
      <div className="col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hidden md:block hidden">
        <div className="divide-y divide-gray-200 space-y-5">
          <div>
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Categories</h3>
            <div className="space-y-2">
              {_.map(categories, (category, index) => (
                <div key={index} className="flex items-center">
                  <input checked={category.value == categoryState} onChange={(e) => {
                    setCategoryState(e.target.value);
                  }} value={category.value} type="radio" name="cat-1" id="cat-1"
                    className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                  <label htmlFor="cat-1" className="text-gray-600 ml-3 cursor-pointer">{category.name}</label>
                  <div className="ml-auto text-gray-600 text-sm">({category.quantity})</div>
                </div>
              ))}
              {/* <div className="flex items-center">
                <input type="checkbox" name="cat-2" id="cat-2"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="cat-2" className="text-gray-600 ml-3 cursor-pointer">Sofa</label>
                <div className="ml-auto text-gray-600 text-sm">(9)</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="cat-3" id="cat-3"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="cat-3" className="text-gray-600 ml-3 cursor-pointer">Office</label>
                <div className="ml-auto text-gray-600 text-sm">(21)</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="cat-4" id="cat-4"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="cat-4" className="text-gray-600 ml-3 cursor-pointer">Outdoor</label>
                <div className="ml-auto text-gray-600 text-sm">(10)</div>
              </div> */}
            </div>
          </div>

          {/* <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Brands</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" name="brand-1" id="brand-1"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="brand-1" className="text-gray-600 ml-3 cursor-pointer">Cooking Color</label>
                <div className="ml-auto text-gray-600 text-sm">(15)</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="brand-2" id="brand-2"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="brand-2" className="text-gray-600 ml-3 cursor-pointer">Magniflex</label>
                <div className="ml-auto text-gray-600 text-sm">(9)</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="brand-3" id="brand-3"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="brand-3" className="text-gray-600 ml-3 cursor-pointer">Ashley</label>
                <div className="ml-auto text-gray-600 text-sm">(21)</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="brand-4" id="brand-4"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="brand-4" className="text-gray-600 ml-3 cursor-pointer">M&D</label>
                <div className="ml-auto text-gray-600 text-sm">(10)</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="brand-5" id="brand-5"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                <label htmlFor="brand-5" className="text-gray-600 ml-3 cursor-pointer">Olympic</label>
                <div className="ml-auto text-gray-600 text-sm">(10)</div>
              </div>
            </div>
          </div> */}

          <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Price</h3>
            <div className="mt-4 flex items-center">
              <input type="text" name="min"
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                placeholder="min" />
              <span className="mx-3 text-gray-500">-</span>
              <input type="text" name="max"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                placeholder="max" />
            </div>
          </div>

          {/* <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Size</h3>
            <div className="flex items-center gap-2">
              <div className="size-selector">
                <input type="radio" name="size" id="size-xs" className="hidden" />
                <label htmlFor="size-xs"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">XS</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-sm" className="hidden" />
                <label htmlFor="size-sm"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">S</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-m" className="hidden" />
                <label htmlFor="size-m"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">M</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-l" className="hidden" />
                <label htmlFor="size-l"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">L</label>
              </div>
              <div className="size-selector">
                <input type="radio" name="size" id="size-xl" className="hidden" />
                <label htmlFor="size-xl"
                  className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">XL</label>
              </div>
            </div>
          </div> */}

          {/* <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Color</h3>
            <div className="flex items-center gap-2">
              <div className="color-selector">
                <input type="radio" name="color" id="red" className="hidden" />
                <label htmlFor="red"
                  className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block"
                  style={{ backgroundColor: '#fc3d57' }}></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="black" className="hidden" />
                <label htmlFor="black"
                  className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block"
                  style={{ backgroundColor: '#000' }}></label>
              </div>
              <div className="color-selector">
                <input type="radio" name="color" id="white" className="hidden" />
                <label htmlFor="white"
                  className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block"
                  style={{ backgroundColor: '#fff' }}></label>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main Content (Products) */}
      <div className="col-span-3">
        <div className="flex items-center mb-4">
          <select
            name="sort"
            id="sort"
            defaultValue=""
            onChange={handleSortChange}
            className="w-44 text-sm text-gray-600 py-3 px-4 border-gray-300 shadow-sm rounded focus:ring-primary focus:border-primary"
          >
            <option value="">Default sorting</option>
            <option value="price-low-to-high">Price low to high</option>
            <option value="price-high-to-low">Price high to low</option>
            <option value="latest">Latest product</option>
          </select>

          <div className="flex gap-2 ml-auto">
            <div
              className="border border-primary w-10 h-9 flex items-center justify-center text-white bg-primary rounded cursor-pointer"
              onClick={() => console.log('Grid view clicked')}
            >
              <FaGripVertical />
            </div>
            <div
              className="border border-gray-300 w-10 h-9 flex items-center justify-center text-gray-600 rounded cursor-pointer"
              onClick={() => console.log('List view clicked')}
            >
              <FaList />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-2 gap-6 mb-5">
          {categoryState === 'combo' ? (
            _.map(comboData, (combo, index) => (
              <ProductCard comboId={combo.compoId} imageUrl={combo.image} link={`/combo/${combo.compoId}`} price={combo.price} discountPrice={combo.price} title={combo.labKitName} key={index} />
            ))
          ) : (
            _.map(itemsData, (item, index) => (
              <ItemCard itemId={item.istemId} imageUrl={item.img} link={`/item/${item.istemId}`} price={item.price} discountPrice={item.price} title={item.istemName} key={index} />
            ))
          )}
        </div>

        <Pagination
          showSizeChanger
          align="center"
          defaultCurrent={page}
          total={pageSize}
          onChange={handleChange}
        />
      </div>
    </main>
  )
}