import { WishlistItem } from "~/components";

export const handle = {
  breadcrumb: true,
}

export default function AccountWishList() {
  return (
    // Wishlist
    < div className="col-span-9 space-y-4" >
      <WishlistItem />
    </div >
  )
}