# Basic-Banking-System-API

# Requirement
  1. JavaScript
  2. Node.JS
  3. Package Management
  4. Express.JS
  5. ORM with Prisma
  6. Postgresql
  7. VSCode
  8. Thunder / Postman
  9. CMD / Terminal
     
# express.js
  1. npm init -y
  2. npm i express nodemon
  3. npm i express jsonwebtoken bcrypt dotenv //Auto authentication

# prisma
  1. npm i prisma
  2. npx prisma init --datasource-provider postgresql
  3. npx prisma migrate dev --name init

# postgresql
DATABASE_URL="postgresql://postgres:user@localhost:5432/bank?schema=public"

# Register a new User and Profile.
  localhost:2000/api/v1/users (POST)

  {
  "name" : "Reza Hans",
  "email" : "rezahans@gmail.com",
  "password" : "123456",
  "identity_type" : "KTP",
  "identity_number": "1010011",
  "address": "Tangerang, Banten"
  }

# Displays the list users.

  localhost:2000/api/v1/users (GET)


# Displays the list users by Id.

  localhost:2000/api/v1/users/1 (GET byId)

# Delete a User and Profile. 

  localhost:2000/api/v1/users/3 (DELETE) 

# Update Profile 
  //User can change name and email or identity type, identity number and address
  localhost:2000/api/v1/users/1/update-profile (PUT)
  
  {
  "name": "Sans JR",
  "email": "sansjr@gmail.com"
  }

  {
  "identity_type" : "KTP",
  "identity_number": "367113333",
  "address": "Tangerang, Banten"
  }

# Update a new Password
localhost:2000/api/v1/users/1/update-password (PUT)

{
  "oldPassword": "123456",
  "newPassword": "reza123"
}

# Create new account to an existing user registered.
localhost:2000/api/v1/accounts (POST)

{
  "userId": 4,
  "bank_name": "Bank BCA",
  "bank_account_number": "1011024019",
  "balance": "1500000"
}

# Update User Account
Localhost:2000/api/v1/accounts (PUT)

{
  "userId": 4,
  "bank_name": "Bank BCA",
  "bank_account_number": "1011024019",
  "balance": "1500000"
}

# Displays the list accounts.
localhost:2000/api/v1/accounts (GET)

# Displays the list account by Id
localhost:2000/api/v1/accounts/1 (GET ById)

# Delete User account
localhost:2000/api/v1/accounts/3 (DELETE)

# send money from 1 account to another account.
  //After that, check the user's account and the money will move to the intended account
localhost:2000/api/v1/transactions (POST)

{
  "source_account_id": 1,
  "destination_account_id": 2,
  "amount": 5000000,
}

# displays Transaction list.
localhost:2000/api/v1/transactions (GET)

# displays Transaction list ById.
localhost:2000/api/v1/transactions/1 (GET ById)

# Delete a Transaction history
localhost:2000/api/v1/transactions/1 (DELETE)
localhost:2000/api/v1/transactions (DELETE)
