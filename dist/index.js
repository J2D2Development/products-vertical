import './styles/app.scss';
import products from './products.js';
import categories from './categories.js';

/*
UP NEXT
-figure out animation of routes- if a user chooses a category, it should shrink and slide up/left (others hide).  if a user chooses a product, it should shrink and slide next to category (others hide)- clearing the way for the main product desc.  maybe have a 'clear' button on selected prod/category to go back to main view for each?  then when search is performed, it should just jump straight to that view (may have to make entire card a 'link' so the styles apply properly?)
  -getting there- need better positioning on the 'active' category: just jumps to top left, but is there a way to animate that properly?- slide it up/left to position 0,0? maybe a tick after the rest fly away?


1) add loading spinner
2) implement search function- show options of features as typing?
  -simple index of check- improve this
3) for animation of selected category, then feature- can we use ui-sref-active?  if applied, keep around but move- otherwise, make small and move?  Or- set a var on the controller and link to each element in repeated grid.  If selected matches element route, use that to keep and !that to make small/hide
4) home: 3 tabs: search, view all, let us help
  -let us help- guided tour
5) https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-animate-ui-view-with-ng-animate


EVENTUALLY
1) production build
  -Sass -> Css
    http://stackoverflow.com/questions/29210325/webpack-sass-where-is-the-css-file
    https://github.com/jtangelder/sass-loader
    https://github.com/webpack/extract-text-webpack-plugin

*/


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

  const categoriesState = {
    name: 'home.categories',
    url: '/categories',
    component: 'categoriesView',
    resolve: {
      categories: function() {
        return categories;
      }
    }
  }

  const categoryState = {
    name: 'home.categories.category',
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
    name: 'home.categories.category.product',
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
  $stateProvider.state(categoriesState);
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
        if(!term) return;
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

app.component('categoriesView', {
  bindings: {categories: '<'},
  templateUrl: './public/templates/categories.html',
  controller: function($stateParams, $rootScope, $location) {
    this.activeCategory = $stateParams.category ? $stateParams.category : '';
    $rootScope.$on('$locationChangeSuccess', () => {
      //console.log('path?', $location.path());
      //console.log('state params:', $stateParams);
      this.activeCategory = $stateParams.category ? $stateParams.category : '';
    });
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
  controller: function() {
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
    return products.filter(function(product) {
      return product.categoryRoute === filterFeaturesBy;
    });
  }
  return products;
}