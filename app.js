// https://www.sice.indiana.edu/doc/career/2018-2019-career-search-guide/Career-Search-Guide-2018-2019.pdf

angular.module('app', []).controller('main', function ($scope) {
    var vm = $scope;

    // generate state
    vm.state = {
        name: '',
        title: '',
        phone: '',
        email: '',
        links: [],
        education: [],
        experience: []
    };

    load();

    // general functions
    vm.save = function () {
        localStorage.state = JSON.stringify(vm.state);
    };

    function load() {
        if (localStorage.state)
            vm.state = JSON.parse(localStorage.state);
    }

    // link functions
    vm.addLink = function () {
        var link = linkFactory();
        vm.state.links.push(link);
        vm.editLink(link);
    };

    vm.editLink = function (item) {
        item.editing = angular.copy(item);
    };

    vm.saveLink = function (item, $index) {
        vm.state.links[$index] = item.editing;
    };

    vm.cancelLink = function (item, $index) {
        if (!Object.keys(item).some(x => x !== 'editing' && item[x]))
            vm.state.links.splice($index, 1);
        else
            delete item.editing;
    };

    vm.deleteLink = function ($index) {
        if (confirm('Delete this link? Are you sure?'))
            vm.state.links.splice($index, 1);
    };

    // education functions
    vm.addEducation = function () {
        var education = educationFactory();
        vm.state.education.push(education);
        vm.editEducation(education);
    };

    vm.editEducation = function (item) {
        item.editing = angular.copy(item);
    };

    vm.saveEducation = function (item, $index) {
        vm.state.education[$index] = item.editing;
    };

    vm.cancelEducation = function (item, $index) {
        console.log(item);

        if (!Object.keys(item).some(x => x !== 'editing' && item[x]))
            vm.state.education.splice($index, 1);
        else
            delete item.editing;
    };

    // experience functions
    vm.addExperience = function () {

    };

    // factories
    function linkFactory() {
        return {
            type: '',
            url: ''
        };
    }

    function educationFactory() {
        return {
            degree: '',
            school: '',
            location: '',
            date: ''
        };
    }

    function experienceFactory() {
        return {
            title: '',
            organization: '',
            location: '',
            date: '',
            blurbs: []
        };
    }
});