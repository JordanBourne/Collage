var app = angular.module('app', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.html',
                controller: 'MainCtrl',
                onEnter: ['images', function(images) {
                        return images.getImages();
                    }],
                resolve: {
                    postPromise: ['auth', function(auth) {
                        return auth.getInfo();
                    }]
                }
            })
            
            .state('profile', {
                url: '/profile',
                templateUrl: '/profile.html',
                controller: 'ProfileCtrl',
                resolve: {
                    postPromise: ['auth', function(auth) {
                        return auth.getInfo();
                    }]
                },
                onEnter: ['images', 'auth', function(images, auth) {
                        return images.searchAuthor(auth.user.username);
                    }]
            })
            
            .state('submit', {
                url: '/submit',
                templateUrl: '/submit.html',
                controller: 'SubmitCtrl',
                resolve: {
                    postPromise: ['auth', function(auth) {
                        return auth.getInfo();
                    }]
                }
            })
        
        $urlRouterProvider.otherwise('home');
}]);
        
app.factory('auth', ['$http', function($http) {
    var o = {
        user: []
    };
    
    o.getInfo = function() {
        $http.get('/profile/currentUser').success(function(data) {
            angular.copy(data, o.user);
        });
    };
    
    return o;
}]);

app.factory('images', ['$http', 'auth', function($http, auth) {
    var o = {
        images: []
    };
    
    o.submitImage = function(imgData) {
        return $http.put('/submitImage', imgData).success(function(data) {
            window.location.href = "#/home"
            //o.images.unshift(data);
        })
    }
    
    o.getImages = function() {
        return $http.get('/getImages').success(function(data) {
            angular.copy(data, o.images);
        })
    }
    
    o.upvote = function (image) {
        return $http.put('/images/' + image._id + '/upvote').success(function(data) {
            image.upvotes += 1;
        })
    }
    
    o.searchAuthor = function(author) {
        return $http.get('/searchAuthor/' + author).success(function(data) {
            angular.copy(data, o.images);
        })
    }
    
    o.searchTag = function(tag) {
        return $http.get('/searchTag/' + tag).success(function(data) {
            angular.copy(data, o.images);
        })
    }
    
    o.delete = function(image) {
        return $http.delete('/images/' + image._id).success(function() {
            o.searchAuthor(auth.user.username);
        })
    };
    
    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'auth',
    'images',
    function($scope, auth, images) {
        $scope.user = auth.user;
        $scope.images = images.images;
        
        
        $scope.postImage = function () {
            if(auth.user.username) {
                window.location.href = '#/submit';
            } else {
                $scope.error = "You must be logged in!";
            }
        }
        
        $scope.upvote = function (image) {
            images.upvote(image);
        }
        
        $scope.searchAuthor = function () {
            images.searchAuthor($scope.byAuthor);
        }
        
        $scope.searchTag = function () {
            images.searchTag($scope.byTag);
        }
        
    }
]);

app.controller('ProfileCtrl', [
    '$scope',
    'auth',
    'images',
    function($scope, auth, images) {
        $scope.user = auth.user;
        $scope.$watch()
        
        $scope.delete = function (image, theIndex) {
            images.delete(image);
            $scope.$apply();
        }
    }
]);

app.controller('SubmitCtrl', [
    '$scope',
    'auth',
    'images',
    function($scope, auth, images) {
        $scope.author = auth.user.username;
        $scope.images = images.images;
        
        $scope.submitImage = function () {
            images.submitImage({
                title: $scope.title,
                link: $scope.link,
                tags: $scope.tags.split(" "),
                author: $scope.author
            })
        }
    }
]);