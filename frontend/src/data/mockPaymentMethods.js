export const initialMockPaymentMethods = [
  {
    id: "pm_1",
    userId: "mock-user",
    type: "card",
    brand: "visa",
    last4: "4921",
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
    stripePaymentMethodId: null
  },
  {
    id: "pm_2",
    userId: "mock-user",
    type: "card",
    brand: "mastercard",
    last4: "8832",
    expMonth: 8,
    expYear: 2026,
    isDefault: false,
    stripePaymentMethodId: null
  }
];

export const initialMockUPI = [
  {
    id: "upi_1",
    userId: "mock-user",
    type: "upi",
    provider: "Google Pay",
    upiId: "user@okaxis",
    isDefault: false
  }
];
