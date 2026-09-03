export const initialMockAddresses = [
  {
    id: "addr_1",
    userId: "mock-user", // This will be dynamic in service
    fullName: "Priya Sharma",
    addressLine1: "A-102, Shanti Vihar Apartments",
    addressLine2: "Opposite Central Park, Phase 2",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560076",
    mobileNumber: "+91 98765 43210",
    type: "HOME",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "addr_2",
    userId: "mock-user",
    fullName: "Priya Sharma",
    addressLine1: "TechPark Towers, 4th Floor, Block C",
    addressLine2: "Outer Ring Road, Marathahalli",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560037",
    mobileNumber: "+91 98765 43210",
    type: "OFFICE",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
