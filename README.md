# Google Zomato Map

An app inspired by Google Maps thats uses Googles Javascript API and Zomato API to display information about different locations. The user can switch between using Google's API or Zomato API, because Zomato is a restaurant review website it will only work when searching for restaurant.


## Usage
The app is very similar to Google Maps but with some differences. To switch between Zomato and Google, click on the Google logo that is next to the search bar. This will flip the logo and show you the Zomato logo which means that you are now using the Zomato API. You can revert back to using the Google API by clicking on the Zomato logo.


## Development
This app uses [npm](npmjs.com) for development. To install all the dependencies for testing and development just make sure you have npm installed and in the root directory of this project run.
```
$ npm install
$ npm run dev
```
The second command will run the webpack dev server so you can view the app locally at `localhost:8080`. Any saved changes to the code should automatically refresh the page.


## Production
To run the production build just open the `dist/index.html` file
To rebuild the production code run
```
$ npm run production
```



## Credit
* The star and half a star svg for the review section was taken and modified from [Nossie](http://codepen.io/nossie/pen/dMrKLQ)
* The spinner css was taken and modified from
[Fran Pérez](https://codepen.io/mrrocks/pen/EiplA)
* The overall design was inspired by [Google Maps](www.google.com/maps)
