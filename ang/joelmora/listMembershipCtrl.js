(function(angular, $, _) {

    angular.module('joelmora').config(function($routeProvider) {
            $routeProvider.when('/listMembership', {
                controller: 'JoelmoralistMembershipCtrl',
                templateUrl: '~/joelmora/listMembershipCtrl.html',
                resolve: {
                    membershipList: function(crmApi) {
                        return crmApi('Membership', 'get', {
                            'api.Contact.getsingle': {},
                            'options': {sort: 'start_date'}
                        });
                    }
                }
            });
        }
    );

    angular.module('joelmora').controller('JoelmoralistMembershipCtrl', function($scope, crmApi, crmStatus, crmUiHelp, membershipList) {
        // The ts() and hs() functions help load strings for this module.
        var ts = $scope.ts = CRM.ts('joelmora');
        var hs = $scope.hs = crmUiHelp({file: 'CRM/joelmora/listMembershipCtrl'}); // See: templates/CRM/joelmora/listMembershipCtrl.hlp

        //membership list
        $scope.membershipList = membershipList;
        
        //clear both filters
        $scope.clearFilters = function()
        {
            this.filter_start_date_from = '';
            this.filter_start_date_to = '';

            $('#filter-div').find('.select2-chosen').html('');
        };
        
        //create relative filters when the page loads
        $scope.$on('$viewContentLoaded', function() {
            $('#filter_start_date_from').crmEntityRef({
                entity: 'option_value',
                api: {params: {option_group_id: 'relative_date_filters', options: {sort:'weight'}}},
                select: {'minimumInputLength': 0}
            });
            $('#filter_start_date_to').crmEntityRef({
                entity: 'option_value',
                api: {params: {option_group_id: 'relative_date_filters', options: {sort:'weight'}}},
                select: {'minimumInputLength': 0}
            });
        });

    });

    //custom relative date filter
    angular.module('joelmora').filter('isBetween', function() {
        return function(items, dateFrom, dateTo) {
            var filtered = [];
            var momentDateFrom;
            var momentDateTo;

            momentDateFrom = relativeDateToMoment(dateFrom);
            momentDateTo = relativeDateToMoment(dateTo);

            angular.forEach(items, function(item) {
                var momentStartDate = moment(item.start_date);

                //just 'from' filter set
                if (momentDateFrom != null && momentDateTo == null) {
                    if (momentStartDate >= momentDateFrom) {
                        filtered.push(item);
                    }
                }

                //just 'to' filter set
                if (momentDateFrom == null && momentDateTo != null) {
                    if (momentStartDate <= momentDateTo) {
                        filtered.push(item);
                    }
                }

                //both filter set
                if (momentDateFrom != null && momentDateTo != null) {
                    if (momentStartDate >= momentDateFrom && momentStartDate <= momentDateTo) {
                        filtered.push(item);
                    }
                }

                //none filter set
                if (momentDateFrom == null && momentDateTo == null) {
                    filtered.push(item);
                }

            });

            return filtered;
        }
    });

})(angular, CRM.$, CRM._);

/**
 * Grab an id of the relative date and transform it into a moment() object
 * @param relative
 * @returns {*}
 */
function relativeDateToMoment(relative)
{
    var momentDateFrom;
    var interval;

    if (typeof relative == 'undefined' || relative == null) {
        return null;
    }

    switch (relative) {
        case 'this.day':
        case 'this.week':
        case 'this.month':
        case 'this.quarter':
        case 'this.year':
        case 'current.week':
        case 'current.month':
        case 'current.quarter':
        case 'current.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().startOf(interval);
            break;
        case 'this.fiscal_year':
            momentDateFrom = moment().set({'month': 'July', 'day': 1});
            break;
        case 'previous.day':
        case 'previous.week':
        case 'previous.month':
        case 'previous.quarter':
        case 'previous.year':
        case 'ending.week':
        case 'ending.month':
        case 'ending.quarter':
        case 'ending.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().subtract(1, interval);
            break;
        case 'ending_2.month':
            momentDateFrom = moment().subtract(2, 'month');
            break;
        case 'ending_2.year':
            momentDateFrom = moment().subtract(2, 'year');
            break;
        case 'ending_3.year':
            momentDateFrom = moment().subtract(3, 'year');
            break;
        case 'previous.fiscal_year':
            momentDateFrom = moment().set({'month': 'July', 'day': 1}).subtract(1, 'year');
            break;
        case 'starting.day':
        case 'next.week':
        case 'next.month':
        case 'next.quarter':
        case 'next.year':
        case 'starting.week':
        case 'starting.month':
        case 'starting.quarter':
        case 'starting.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().add(1, interval);
            break;
        case 'starting_2.month':
            momentDateFrom = moment().add(2, 'month');
            break;
        case 'next.fiscal_year':
            momentDateFrom = moment().set({'month': 'July', 'day': 1}).add(1, 'year');
            break;
        case 'earlier.day':
        case 'earlier.week':
        case 'earlier.month':
        case 'earlier.quarter':
        case 'earlier.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().subtract(1, interval).endOf(interval);
            break;
        case 'greater.day':
        case 'greater.week':
        case 'greater.month':
        case 'greater.quarter':
        case 'greater.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().add(1, interval).startOf(interval);
            break;
        case 'less.day':
        case 'less.week':
        case 'less.month':
        case 'less.quarter':
        case 'less.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().endOf(interval);
            break;
        case 'previous_2.day':
        case 'previous_2.week':
        case 'previous_2.quarter':
        case 'previous_2.year':
        case 'previous_before.day':
        case 'previous_before.week':
        case 'previous_before.month':
        case 'previous_before.quarter':
        case 'previous_before.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().subtract(2, interval);
            break;
        case 'greater_previous.week':
        case 'greater_previous.month':
        case 'greater_previous.quarter':
        case 'greater_previous.year':
            interval = relative.split('.')[1];
            momentDateFrom = moment().subtract(1, interval).endOf(interval);
            break;
    }

    return momentDateFrom;
}