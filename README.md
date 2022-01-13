  # Campers
    Campers is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.
    This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.
  ## Features
  - Users can create, edit, and remove campgrounds
  - Users can review campgrounds once, and edit or remove their review
  - User can create , view campgrounds location.
  - User can upload campground images.
  ## Run it locally
  1. Install mongodb
  2. Create a cloudinary account to get an API key and secret code and also create mapbox account to get mapbox token.
  ``` 
  git clone https://github.com/mayurPardeshi99/campers.git
  cd campers
  npm install
  ```
  #### Create a .env file in the root of the project and add the following:
  ``` 
  CLOUDINARY_CLOUD_NAME='<cloudinary_cloud_name>'
CLOUDINARY_KEY=''<key>
CLOUDINARY_SECRET='<secret>'
MAPBOX_TOKEN='<tokent>'
```
Run mongod in another terminal and node app.js in the terminal with the project.

Then go to [localhost/3000](http://localhost:3000/)
