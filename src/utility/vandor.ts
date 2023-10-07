import { Vandor } from "../models/vandor.model";

export const findVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email });
  }

  return await Vandor.findById(id);
};
