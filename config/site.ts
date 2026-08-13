export const siteConfig = {
  name: "BuzzieWorld",

  description: "A magical world of toys, books, learning, creativity and play.",

  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  email: "hello@buzzieworld.com",

  currency: "INR",

  locale: "en-IN",

  country: "India",

  social: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
} as const;
