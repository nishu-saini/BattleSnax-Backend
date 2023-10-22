# Battle-Snax Application

BattleSnax is a NodeJS based server-side application designed to provide efficient food delivery services. It employs a modular architecture with distinct routes catering to various user roles.

The platform accommodates a variety of roles, each with its own set of responsibilities and functionalities, including admins, delivery personnel, users, and vendors.

## API Routes

Following APIs are designed to handled various functionalities:

- **Admin API** : Managed by administrators, this route provides comprehensive control over user, vendor, and delivery management, along with issue resolution capabilities.

- **Delivery API** : Dedicated to delivery personnel, this route handles delivery requests, order status updates, and incident reporting.

- **Vendor API** : Vendors personalize their profiles, manage their menus, fulfill orders, and receive feedback from users.

- **User API** : Tailored for regular users, this route facilitates profile management, order tracking, and the option to save favorite items and vendors

- **Shopping API** : Designed for shoppers, this route enables searching for vendors, adding items to carts, placing orders, and rating vendors.

## API Endpoints

### Admin Endpoints

- `/admin/vandors` : Get vandors - `GET`

- `/admin/vandor/:id` : Get vandor by ID - `GET`

- `/admin/login` : Login admin - `POST`

- `/admin/vandor` : Create vandor - `POST`

- `/admin/transactions` : Get all transactions - `GET`

- `/admin/transaction/:id` : Get a transaction BY ID - `GET`

- `/admin/delivery/users` : Get all delivery person - `GET`

- `/admin/delivery/verify`: Verify delivery user - `PUT`

- `/admin/delivery/user/:id` : Get delivery user by ID - `GET`

### Vandor Endpoints

- `/vandor/login` : Login vandor - `POST`

- `/vandor/profile` : Get profile - `GET`

- `/vandor/food` : Add food - `POST`

- `/vandor/foods` : Get all foods - `GET`

- `/vandor/profile` : Update profile - `PATCH`

- `/vandor/service` : Update service - `PATCH`

- `/vandor/coverimage` : Update cover image - `PATCH`

- `/vandor/orders` : Get all order details - `GET`

- `/vandor/order/:id` : Get order by ID - `GET`

- `/vandor/order/:id/process` : Update an Order status - `PUT`

- `/vandor/offer` : Add offer - `POST`

- `/vandor/offers` : Get all offers - `GET`

- `/vandor/offer/:id` : Update offer - `PUT`

### Shopping Endpoints

- `/:pincode` : Get food availability - `GET`

- `/top-restaurants/:pincode` : Get top Restaurants - `GET`

- `/foods-in-30-min/:pincode` : Food in 30 min - `GET`

- `/searcg/:pincode` : Search food - `GET`

- `/restaurant/:id` : Restaurant BY ID - `GET`

- `/offers/:pincode` : Available offers - `GET`

### User Endpoints

- `/user/signup` : User sing up - `POST`

- `/user/verify` : Verify user - `PATCH`

- `/user/login` : User Login - `POST`

- `/user/otp` : Request OTP - `GET`

- `/user/profile` : Update profile - `PATCH`

- `/user/profile` : Get user profile - `GET`

- `/user/create-order` : Create Order - `POST`

- `/user/orders` : Get all order details - `GET`

- `/user/order/:id` : Get Order by ID - `GET`

- `/user/cart` : Add to cart food - `POST`

- `/user/cart` : Get cart food - `GET`

- `/user/cart` : Delete Cart - `DELETE`

- `/user/offer/verify/:id` : Verify offer - `GET`

### Delivery Endpoints

- `/delivery/signup` : Delivery person signup - `POST`

- `/delivery/login` : Delivery person login - `POST`

- `/delivery/change-status` : Change status - `PUT`

## Essential Variables

Create an `.env` file at `root` dir.

Provide essential `variable` details given below.

```
PORT =

MONGO_URI =

JWT_SECRET =

ACCOUNT_SID = <Twilio SID>

AUTH_TOKEN = <Twilio Toke>

PHONE_NUMBER = <Twilio Number>

```
