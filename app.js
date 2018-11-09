// https://www.sice.indiana.edu/doc/career/2018-2019-career-search-guide/Career-Search-Guide-2018-2019.pdf

angular.module('app', ['ngPopup']).controller('main', function ($scope) {
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

    vm.export = false;

    load();

    // save/load
    vm.save = function () {
        localStorage.state = JSON.stringify(vm.state);

        prepareExport(vm.state);
    };

    function load() {
        if (localStorage.state) {
            vm.state = JSON.parse(localStorage.state);

            prepareExport(vm.state);
        }
    }

    // import/export
    function prepareExport(data) {
        var blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'text/json'
        });

        vm.export = true;
        
        setTimeout(function() {
            var a = document.querySelector('a[ng-if=export]');

            a.download = 'resume.json';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        }, 0);
    }

    // link functions
    vm.addLink = function () {
        vm.adding = {
            item: linkFactory()
        };
        vm.popups['Add Link'].viewPopup();
    };

    vm.addLinkCommit = function () {
        vm.adding.item.type = determineLinkType(vm.adding.item.url);
        vm.state.links.push(vm.adding.item);

        vm.popups['Add Link'].hidePopup();

        sortableRows();
    };

    vm.editLink = function (item, $index) {
        vm.editing = {
            item: angular.copy(item),
            $index: $index
        };
        vm.popups['Edit Link'].viewPopup();
    };

    vm.editLinkCommit = function () {
        vm.editing.item.type = determineLinkType(vm.editing.item.url);
        vm.state.links[vm.editing.$index] = vm.editing.item;
        vm.popups['Edit Link'].hidePopup();
    };

    vm.deleteLink = function ($index) {
        if (confirm('Delete this row? Are you sure?'))
            vm.state.links.splice($index, 1);
    };

    // helper
    function determineLinkType(url) {
        var typeDict = {
            'linkedin.com': 'LinkedIn',
            'twitter.com': 'Twitter',
            'github.com': 'GitHub'
        };

        for (var key of Object.keys(typeDict))
            if (new RegExp('\\b' + key, 'i').test(url))
                return typeDict[key];

        return 'Other';
    }

    vm.linkTypes = {
        'LinkedIn': 'fab fa-linkedin',
        'Twitter': 'fab fa-twitter-square',
        'GitHub': 'fab fa-github-square',
        'Other': 'fas fa-globe-americas'
    }

    // education functions
    vm.addEducation = function () {
        vm.adding = {
            item: educationFactory()
        };
        vm.popups['Add Education'].viewPopup();
    };

    vm.addEducationCommit = function () {
        vm.state.education.push(vm.adding.item);

        vm.popups['Add Education'].hidePopup();

        sortableRows();
    };

    vm.editEducation = function (item, $index) {
        vm.editing = {
            item: angular.copy(item),
            $index: $index
        };
        vm.popups['Edit Education'].viewPopup();
    };

    vm.editEducationCommit = function () {
        vm.state.education[vm.editing.$index] = vm.editing.item;
        vm.popups['Edit Education'].hidePopup();
    };

    vm.deleteEducation = function ($index) {
        if (confirm('Delete this row? Are you sure?'))
            vm.state.education.splice($index, 1);
    };

    // experience functions
    vm.addExperience = function () {
        vm.adding = {
            item: experienceFactory()
        };
        vm.popups['Add Experience'].viewPopup();
    };

    vm.addExperienceCommit = function () {
        vm.state.experience.push(vm.adding.item);

        vm.popups['Add Experience'].hidePopup();

        sortableRows();
    };

    vm.editExperience = function (item, $index) {
        vm.editing = {
            item: angular.copy(item),
            $index: $index
        };
        vm.popups['Edit Experience'].viewPopup();
    };

    vm.editExperienceCommit = function () {
        vm.state.experience[vm.editing.$index] = vm.editing.item;
        vm.popups['Edit Experience'].hidePopup();
    };

    vm.deleteExperience = function ($index) {
        if (confirm('Delete this row? Are you sure?'))
            vm.state.experience.splice($index, 1);
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
            timespan: ''
        };
    }

    function experienceFactory() {
        return {
            title: '',
            organization: '',
            location: '',
            timespan: '',
            blurbs: []
        };
    }

    // sortable rows
    function sortableRows() {
        setTimeout(function () {
            var s = sortable('[ng-sortable]', {
                forcePlaceholderSize: true,
                handle: '[ng-sort]'
            });

            for (var e of s)
                e.addEventListener('sortupdate', sortUpdate);
        }, 0);

        function sortUpdate(e) {
            // Determine moved node and new position
            var oldIndex = e.detail.origin.index;
            var newIndex = e.detail.destination.index;

            var $repeater = $(e.target).children('[ng-repeat]:first-of-type'); // get the repeater that references the collection

            var collectionName = /[^ ]+ in ([^ ]+)/.exec($repeater.attr('ng-repeat'))[1]; // get the name of the collection
            var collection = getVariable(collectionName); // get the actual collection

            var item = collection.splice(oldIndex, 1)[0]; // remove and grab item
            collection.splice(newIndex, 0, item); // move item to new location

            vm.$apply();
        }
    }

    sortableRows();

    // helpers
    function getVariable(x) { // get a scope variable by its name, even if it's nested, e.g. "state.education"
        var result = vm;

        for (var key of x.split('.'))
            result = result[key];

        return result;
    }
});