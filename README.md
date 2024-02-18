# Ecommerce-backend
![изображение](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/2a69f124-cced-459a-a2ff-605914d3c6ca)


## Products
ALL PRODUCT - "api/products/" return a list of all products.
You can specify parametrs for this response:  filterQuery sortQuery limitFields paginate;

FULL INFO ABOUT PRODUCT - "api/products/:productId" return full information by query id and show specifics

UPDATE PRODUCT - "api/products/:productId" only for admins for update info or image of product

ADD PRODUCT - "api/products/" only for admins for add product

DELETE PRODUCT - "api/products/:productId" only for admins for delete product

Get Users
This endpoint is used to retrieve a list of users.

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

## CART
PATCH ADD TO CART - '/api/cart/add-to-cart/:productId' to add to cart product (based on quantity)

PATCH DELETE FROM CART - '/api/cart/delete-from-cart/:productId' to delete product from cart (based on quantity)

GET MY CART - 'api/cart/my-cart' show user cart list

## DATBASE STRUCTURE!
![db2](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/c6bbd1bd-9c00-4e70-86aa-077336305b33)


## EMAILS
Used pug for html template e mail from  https://github.com/leemunroe/responsive-html-email-template

![изображение](https://github.com/IvanMalkS/Ecommerce-backend/assets/77716298/f407f06a-aef5-44b6-9bd6-89672bdd8521)


