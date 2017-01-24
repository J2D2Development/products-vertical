import './styles/app.scss';
import products from './products.js';

/*
UP NEXT
-fix routing in category state (should be category/product instead of showing all on first load)
  -click view all- goes to 'categories' state- then click category, goes to 'categories/{category} state, then click product, goes to 'categories/{category}/{product} state.  will this work with search and other states?  I think so
-fix routing on search results: links not getting proper params?


1) add loading spinner
2) implement search function- show options of features as typing?
  -simple index of check- improve this
4) home: 3 tabs: search, view all, let us help
  -search shows search input, below that is live reload as type of products (filter over json for title, desc, category)
  -view all goes to category list, click one, get all prods in that category (or all), click link, get product)
  -let us help- guided tour
5) https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-animate-ui-view-with-ng-animate


EVENTUALLY
1) production build
  -Sass -> Css
    http://stackoverflow.com/questions/29210325/webpack-sass-where-is-the-css-file
    https://github.com/jtangelder/sass-loader
    https://github.com/webpack/extract-text-webpack-plugin

*/

const categories = [ 'Accounting', 'Bank Operations', 'Central Bank Operations', 'General Operations', 'Investment Management', 'Loans', 'Real Estate', 'Trust', 'Services and Software Features', ];
const industries = [ 'Brokerage Firms', 'Central Banks', 'Commercial Banks', 'Corporations', 'Fund Managers', 'Insurance Companies', 'Investment Managers', 'Municipalities', 'Real Estate', 'RTA (Registrar / Transfer / Paying Agent)' ];

const app = angular.module('app', ['ui.router']);

app.config(function($stateProvider) {
  const homeState = {
    name: 'home',
    url: '',
    component: 'homeView',
    resolve: {
      features: function() {
        return getFeatures();
      }
    }
  }

  const searchState = {
    name: 'home.search',
    url: '/search',
    component: 'searchView',
    resolve: {
      features: function() {
        return getFeatures();
      }
    }
  }

  const guideState = {
    name: 'home.guide',
    url: '/guide',
    component: 'guideView'
  }

  const categoryState = {
    name: 'home.category',
    url: '/{category}',
    component: 'categoryView',
    resolve: {
      features: function($stateParams) {
        let filter = $stateParams.category === 'all' ? null : $stateParams.category;
        return getFeatures(filter);
      }
    }
  }
  
  const productState = {
    name: 'home.category.product',
    url: '/{productPath}',
    component: 'productDetails',
    resolve: {
      product: function($stateParams) {
        return products.find(function(p) {
          return p.route === $stateParams.productPath;
        });
      }
    }
  };
  
  $stateProvider.state(homeState);
  $stateProvider.state(searchState);
  $stateProvider.state(guideState);
  $stateProvider.state(categoryState);
  $stateProvider.state(productState);
});

app.component('homeView', {
  bindings: {features: '<'},
  templateUrl: './public/templates/homepage.html',
  controller: function() {
  }
});

app.component('searchView', {
  bindings: {features: '<'},
  templateUrl: './public/templates/search.html',
  controller: function() {
    this.searchTerm = '';
    this.results = [];

    this.fireSearch = function() {
      this.results = this.features.filter(feature => {
        const term = this.searchTerm.toLowerCase();
        const name = feature.name.toLowerCase();
        const desc = feature.description.toLowerCase();
        const category = feature.category.toLowerCase();
        return name.indexOf(term) !== -1 || category.indexOf(term) !== -1 || desc.indexOf(term) !== -1;
      });
    }

    this.clearSearch = function() {
      this.searchTerm = '';
      this.results = [];
    }
  }
});

app.directive('searchResults', function() {
  return {
    restrict: 'E',
    scope: { products: '='},
    templateUrl: './public/templates/search-results.html'
  }
});

app.component('guideView', {
  templateUrl: './public/templates/guide-home.html',
  controller: function() {
  }
});

app.component('categoryView', {
  bindings: {features: '<'},
  templateUrl: './public/templates/category.html',
  controller: function($stateParams) {
    this.cat = $stateParams.category;
  }
});

app.component('productDetails', {
  bindings: {product: '<'},
  template: '<div class="feature-card-wrapper"><div class="card-full"><div class="card-full--headline">{{$ctrl.product.name}}</div><div class="card-full--main">{{$ctrl.product.description}}</div><div class="card-full--links"><a ui-sref="">Back</a></div></div></div>',
  controller: function($state) {
    console.log('details state:', $state);
    console.log('details products:', this.product);
  }
});

// app.run(function($rootScope, $location) {
//   console.log('in run, rootscope:', $rootScope);
//   $rootScope.$on('$locationChangeSuccess', function() {
//     $rootScope.showDetails = false;
//     if($location.path() && $location.path() !== '/search') {
//       $rootScope.showDetails = true;
//     }
//   });
// });

function getFeatures(filterFeaturesBy) {
  if(filterFeaturesBy) {
    console.log('filter features by:', filterFeaturesBy);
    let p = products.filter(function(product) {
      return product.categoryRoute === filterFeaturesBy;
    });
    console.log('products:', p);
    return p;
  }
  return products;
}



//old category view
// '<div class="feature-cards-wrapper"><div class="card-mid" ng-repeat="feature in $ctrl.features"><div class="card-mid--headline">{{feature.name}}</div><div class="card-mid--main">{{feature.shortDescription}}</div><div class="card-mid--links"><a ui-sref="home.category.product({category: feature.category, productId: feature.id})" ui-sref-active="active">Details</a></div></div></div><ui-view></ui-view>'