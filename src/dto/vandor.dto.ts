export interface createVandorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface vandorLoginInputs {
  email: string;
  password: string;
}

export interface vandorPayload {
  _id: string;
  email: string;
  name: string;
  foodType: [string];
}

export interface editVandorInputs {
  name: string;
  address: string;
  phone: string;
  foodType: [string];
}

export interface createOfferInputs {
  offerType: string; // VANDOR // GENERIC
  vandors: [any]; // ['8934wornkweyr14']
  title: string; // INR 200 off on week days
  description: string; // Any description with Terms and Conditions
  minValue: number; // minimum order amount should be 300
  offerAmount: number; // 200
  startValidity: Date;
  endValidity: Date;
  promocode: string; // WEEK200
  promoType: string; // USER //ALL // BANK // CARD
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}
