import { vandorPayload } from "./vandor.dto";
import { userPayload } from "./user.dto";

export type authPayload = vandorPayload | userPayload;
