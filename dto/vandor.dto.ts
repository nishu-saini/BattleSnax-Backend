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
