import './styles/app.scss';
import products from './products.js';

/*
1) on search show: set focus to input field:
 http://stackoverflow.com/questions/25596399/set-element-focus-in-angular-way
2) implement search function- show options of features as typing?
3) fetch data from django api (should already exist)
  --may set up service for this
4) clicking one moves the 'card' li view to the right and fills screen with full details.  want to go back or switch states?  have other items in that category available below original card (which migrated to top right below menu)
5) https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-animate-ui-view-with-ng-animate
*/

const app = angular.module('app', ['ui.router']);

app.config(function($stateProvider) {
  var homeState = {
    name: 'home',
    url: '',
    component: 'homeView',
    resolve: {
      features: function() {
        return getFeatures();
      }
    }
  }
  
  var productState = {
    name: 'home.product',
    url: '/{productId}',
    component: 'productDetails',
    resolve: {
      product: function($stateParams) {
        return products.find(function(p) {
          return p.id === $stateParams.productId;
        });
      }
    }
  };
  
  $stateProvider.state(homeState);
  $stateProvider.state(productState);
});

app.component('homeView', {
  bindings: {features: '<'},
  template: '<div class="feature-cards-wrapper" ng-if="$ctrl.showDetails"><div class="card-mid" ng-repeat="feature in $ctrl.features"><div class="card-mid--headline">{{feature.name}}</div><div class="card-mid--main">{{feature.shortDescription}}</div><div class="card-mid--links"><a ui-sref="home.product({productId: feature.id})" ui-sref-active="active">Details</a></div></div></div><ui-view></ui-view>',
  controller: function($state) {
    this.showDetails = true;
  }
});

app.controller('searchCtrl', function($scope) {
    console.log('search ctrl loaded');
    this.searchTerm = '';
    this.searchShow = false;
    this.resetSearch = function() {
      this.searchTerm = '';
    }
    this.showSearch = function(action) {
      this.searchShow = action;
      console.log('this.searchShow:', this.searchShow);
    }
});

app.component('productDetails', {
  bindings: {product: '<'},
  template: '<div class="feature-card-wrapper"><div class="card-full"><div class="card-full--headline">{{$ctrl.product.name}}</div><div class="card-full--main">{{$ctrl.product.fullDescription}}</div><div class="card-full--links"><a ui-sref="">Back</a></div></div></div>',
  controller: function($state) {
    console.log('details state:', $state);
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

function getFeatures(sp) {
  //change this to fetch from http (promise)
  if(sp && sp.category === 'popular') {
    return products.filter(function(product) {
      return product.category === 'popular';
    });
  } else {
    return products;
  }
}