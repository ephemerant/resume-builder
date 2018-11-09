// By Clayton McGuire
angular.module('ngPopup', [])
    .directive('ngPopup', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                title: '@title',
                clickToClose: '@clickToClose',
                width: '@width'
            },
            terminal: true,
            controller: function ($scope) {
                var vm = $scope;

                vm.show = false;
                vm.active = false;

                vm.viewPopup = function () {
                    proxyParent();
                    vm.show = true;
                };

                var $parent = vm;

                while ($parent.$parent) {
                    $parent = $parent.$parent;

                    if ($parent.$$ChildScope)
                        break;
                }

                // Make popup accessible by parent
                $parent.popups = $parent.popups || {};
                $parent.popups[vm.title] = vm;

                // Hide popup
                vm.hidePopup = function (event) {
                    if (event) {
                        var $target = $(event.target);

                        if (event.type === 'click' && vm.clickToClose === 'false')
                            return;
                    }

                    if (!event || $target.attr('ng-click') === 'hidePopup($event)')
                        vm.show = false;
                };

                vm.hidePopupOnEscape = function (event) {
                    if (event.which == 27 && vm.clickToClose !== 'false')
                        vm.show = false;
                };

                // Popup animation
                vm.$watch('show', function () {
                    setTimeout(function () {
                        vm.active = vm.show;
                        vm.$apply();

                        $('[ng-if="show"] > div').focus();
                    }, 100);
                });

                // Make parent variables accessible by popup
                function proxyParent() {
                    Object.keys($parent).forEach(function (key) {
                        if (vm[key] === undefined && key.indexOf('$$') === -1) { // Don't overwrite or import special Angular properties
                            Object.defineProperty(vm, key, {
                                get: function () {
                                    return $parent[key];
                                }
                            });
                        }
                    });
                }
            },
            compile: function (popup) {
                var $ = angular.element;

                // Create the popup
                return function (vm, parent) {
                    // Use a non-jQlite implemention of find() in order to search for tags and classes
                    function find(_this, query) {
                        if (!query) return $();

                        var ret = [];

                        angular.forEach(_this, function (el) {
                            if (el.querySelectorAll) {
                                angular.forEach(el.querySelectorAll(query), function (item) {
                                    ret.push(item);
                                });
                            }
                        });

                        return $(ret);
                    }

                    // Grab and clear the table's HTML to re-inject later
                    var $body = $(popup.html());

                    var template = `
<div class="item-popup-wrapper" ng-class="{ active: active }" ng-if="show" ng-click="hidePopup($event)" style="cursor: {{ clickToClose === 'false' ? 'auto' : 'pointer' }};">
  <div class="item-popup" ng-keydown="hidePopupOnEscape($event)" tabindex="1" style="{{ width ? 'width: ' + width + 'px' : '' }};">
    <h3>{{ title }}</h3>
    <div class="inject-body"></div>
  </div>
</div>`;

                    var $template = $(template);
                    find($template, '.inject-body').replaceWith($body);

                    $compile($template)(vm);
                    parent.replaceWith($template);
                };
            }
        };
    });