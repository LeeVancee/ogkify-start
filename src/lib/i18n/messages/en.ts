export const en = {
  common: {
    language: {
      label: "Language",
      english: "English",
      traditionalChinese: "Traditional Chinese",
      simplifiedChinese: "Simplified Chinese",
    },
    actions: {
      close: "Close",
      retry: "Try Again",
      home: "Home",
      goBack: "Go Back",
      continueShopping: "Continue Shopping",
      search: "Search",
    },
    states: {
      notFound: "This page could not be found.",
    },
  },
  shop: {
    header: {
      allProducts: "All Products",
      search: "Search",
      searchPlaceholder: "Search products...",
      toggleMenu: "Toggle menu",
      account: "Account",
      cart: "Cart",
    },
    userMenu: {
      login: "Login",
      dashboard: "Dashboard",
      myOrders: "My Orders",
      profile: "Profile",
      logout: "Log out",
    },
    cart: {
      eyebrow: "Quick Cart",
      title: "Your Cart",
      itemCount_one: "{{count}} item",
      itemCount_other: "{{count}} items",
      descriptionWithItems:
        "{{count}} selection{{plural}} ready to review before secure checkout.",
      descriptionEmpty: "Add a few picks and they will show up here.",
      loading: "Loading cart...",
      loadError: "We could not load your cart right now.",
      emptyTitle: "Your cart is empty",
      emptyDescription:
        "Keep exploring curated essentials and add the ones you want to review here before checkout.",
      fastCheckout: "Fast checkout",
      freeShipping: "Free shipping",
      securePayment: "Secure payment",
      standard: "Standard",
      removeLabel: "Remove {{name}}",
      decreaseLabel: "Decrease quantity for {{name}}",
      increaseLabel: "Increase quantity for {{name}}",
      removedToast: "Item removed from cart",
      removeErrorToast: "Failed to remove item",
      updateErrorToast: "Failed to update quantity",
      checkoutErrorToast: "Checkout process failed",
      subtotal: "Subtotal",
      shipping: "Shipping",
      free: "Free",
      total: "Total",
      securePaymentNote:
        "Payment details are encrypted and processed securely by Stripe.",
      viewCart: "View Cart",
      processing: "Processing...",
      checkout: "Checkout",
    },
  },
  auth: {
    login: {
      title: "Sign In",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      submit: "Sign In",
      submitting: "Signing in...",
      createAccountPrompt: "Don't have an account?",
      createAccountLink: "Sign Up",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      passwordRequired: "Password is required",
      passwordMin: "Password must be at least 6 characters",
      success: "Signed in successfully",
      failed: "Login failed",
    },
    signup: {
      title: "Create Account",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      submit: "Sign Up",
      submitting: "Creating...",
      existingAccountPrompt: "Already have an account?",
      loginLink: "Sign In",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      passwordRequired: "Password is required",
      passwordMin: "Password must be at least 6 characters",
      success: "Account created successfully",
      failed: "Signup failed",
    },
  },
  dashboard: {
    brand: {
      title: "OGKIFY Admin",
      subtitle: "Commerce Control",
    },
    nav: {
      overview: "Overview",
      dashboard: "Dashboard",
      catalog: "Catalog",
      categories: "Categories",
      colors: "Colors",
      sizes: "Sizes",
      products: "Products",
      operations: "Operations",
      orders: "Orders",
    },
  },
} as const;

type MessageShape<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : MessageShape<T[K]>;
};

export type Messages = MessageShape<typeof en>;
