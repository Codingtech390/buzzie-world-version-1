import {
  Heart,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  Package,
  Settings,
  ShoppingBag,
  UserRound,
  Truck,
} from "lucide-react";

export const ACCOUNT_NAVIGATION = [
  {
    href: "/account",
    label: "Overview",
    description: "Your account at a glance",
    icon: LayoutDashboard,
  },
  {
    href: "/account/profile",
    label: "Profile",
    description: "Personal information",
    icon: UserRound,
  },
  {
    href: "/account/orders",
    label: "Orders",
    description: "Track your purchases",
    icon: Package,
  },
  {
    href: "/account/track-order",
    label: "Track Order",
    description: "Track your shipment",
    icon: Truck,
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    description: "Saved products",
    icon: Heart,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    description: "Delivery addresses",
    icon: MapPin,
  },
  {
    href: "/account/reviews",
    label: "Reviews",
    description: "Your product reviews",
    icon: MessageSquareText,
  },
  {
    href: "/account/settings",
    label: "Settings",
    description: "Account preferences",
    icon: Settings,
  },
] as const;

export const ACCOUNT_STORE_LINK = {
  href: "/products",
  label: "Back to Store",
  description: "Continue shopping",
  icon: ShoppingBag,
} as const;
