"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
// connect database
(0, database_1.default)();
const PORT = process.env.PORT;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});
//# sourceMappingURL=server.js.map