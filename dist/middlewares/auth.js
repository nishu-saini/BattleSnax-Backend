"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const password_1 = require("../utility/password");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validate = yield (0, password_1.validateSignature)(req);
    if (validate) {
        return next();
    }
    return res.status(401).json({
        message: "User Not Authenticated",
    });
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=auth.js.map