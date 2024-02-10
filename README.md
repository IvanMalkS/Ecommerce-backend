# Ecommerce-backend
![изображение](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/6b134bb7-fd53-413c-b1f0-dee10550db5f)

## Products
ALL PRODUCT - "api/products/" return a list of all products.
You can specify parametrs for this response:  filterQuery sortQuery limitFields paginate;

FULL INFO ABOUT PRODUCT - "api/products/:productId" return full information by query id and show specifics

UPDATE PRODUCT - "api/products/:productId" only for admins for update info or image of product

ADD PRODUCT - "api/products/" only for admins for add product

DELETE PRODUCT - "api/products/:productId" only for admins for delete product

Get Users
This endpoint is used to retrieve a list of users.
![изображение](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/02b6b25b-d5f1-4edd-8573-89b109735396)

GET ALL USERS  - "api/users" for admin to get a list of users

REGISTRATION - "api/users/signup" for registration a new user(also send email with link on catalog)

LOGIN - "api/users/login" to log a user by email and password also jwt token

FORGOT PASSWORD - "api/users/forgotPassword" send a email with link to change a password

RESET PASSWORD - "api/users/resetPassword/:tokenId" by email link with password hashed code provied to change a password

### Update user info

UPDATE MY PASSWORD - "api/users/updateMyPassword" for change password in profile (need AUTHENTICATION) and old password

UPDATE PROFILE - "api/users/updateMyInfo" for update profile by user

DELETE PROFILE - "api/users/deleteMe" not delete user from DB give a field isActive : false

ME - "api/users/me" GET for profile

## REVIEW

GET ALL REVIEWS - "api/reviews" get a list of whole reviews

GET ALL REVIEWS OF PRODUCT - "api/products/:productid/reviews" get a list of reviews of a product

EDIT REVIEW - "api/products/:productid/reviews" to change a review of user

DELETE REVIEWS - "api/products/:productid/reviews" to delete a review


## DATBASE STRUCTURE!
![db](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/97966891-8f13-488c-a55c-f4b1a4cc029c)

## EMAILS
Used pug for html template e mail from  https://github.com/leemunroe/responsive-html-email-template

![изображение](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/f407f06a-aef5-44b6-9bd6-89672bdd8521)


