const URL = "https://fir-1c7de-default-rtdb.firebaseio.com/ngoManagment";
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.loginUserDetails = localStorage.getItem("userDetails");
    $scope.loginUserDetails = JSON.parse($scope.loginUserDetails);
    $scope.donorDetails = {};
    $scope.viewDonationData = [];
    $scope.campaignDetails = {};
    $scope.volunteersDetails = {};
    $scope.volunteersFilterData = [];
    $scope.search = "";
    $scope.onPageload = function () {
        $(".donationCls").show();
        $(".participateCls").hide();
        $(".referCls").hide();
        $(".campaignCls").hide();
        getDonationData();
        getFundRaisData();
    }
    $scope.filterData = function () {
        $scope.volunteersFilterData = $scope.volunteersData.filter(function (obj) {
            return obj.campaignDetails.campaignTitle === $scope.seacrh;
        })
    }
    // Donation
    function getDonationData() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/donation.json",
            success: function (response) {
                $scope.viewDonationData = [];
                for (let i in response) {
                    let data = response[i];
                    data["donationId"] = i;
                    $scope.viewDonationData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.submitDonationdata = function () {
        if ($scope.donorDetails.fundraisingDetails === "" || $scope.donorDetails.fundraisingDetails === undefined) {
            alert("Please Select Fundraise Name");
            return false;
        }
        delete $scope.donorDetails.fundraisingDetails['$$hashKey'];
        let fundRaisData = $scope.donorDetails.fundraisingDetails
        fundRaisData.currentAmmout = Number(fundRaisData.currentAmmout) + Number($scope.donorDetails.donationAmmount);

        $.ajax({
            type: 'patch',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/fundRaising/" + fundRaisData.fundraisingId + ".json",
            data: JSON.stringify(fundRaisData),
            success: function (response) {
                getFundRaisData();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/donation.json",
            data: JSON.stringify($scope.donorDetails),
            success: function (response) {
                $('#donationModelId').modal('hide');
                alert("Donation added sucessfully!!!");
                getDonationData();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    // Volunteers
    function getVolunteersdata() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/volunteers.json",
            success: function (response) {
                $scope.volunteersData = [];
                for (let i in response) {
                    let data = response[i];
                    data["volunteersId"] = i;
                    $scope.volunteersData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.submitVolunteersData = function () {
        delete $scope.volunteersDetails["$$hashKey"];
        delete $scope.volunteersDetails.campaignDetails["$$hashKey"];
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/volunteers.json",
            data: JSON.stringify($scope.volunteersDetails),
            success: function (response) {
                $('#participatelId').modal('hide');
                alert("Operation Completed Sucessfully!!!");
                getVolunteersdata();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    // FUNDRAISING
    $scope.funraiseEdit = function (data) {
        $scope.isEdit = true;
        $scope.fundraisingDetails = { ...data };
    }
    function getFundRaisData() {
        $scope.viewFundraisingData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/fundRaising.json",
            success: function (response) {
                for (let i in response) {
                    let data = response[i];
                    data["fundraisingId"] = i;
                    $scope.viewFundraisingData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.submitFundraisData = function () {
        delete $scope.fundraisingDetails["$$hashKey"];
        let url = URL + "/fundRaising.json";
        let methodType = "post";
        if (!$scope.isEdit) {
            $scope.fundraisingDetails.currentAmmout = 0;
        } else {
            url = URL + "/fundRaising/" + $scope.fundraisingDetails.fundraisingId + ".json";
            methodType = "patch";
        }
        if ($scope.isEdit) {
            updateFundRaiseDetailsInDonerTable();
        }
        $.ajax({
            type: methodType,
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: url,
            data: JSON.stringify($scope.fundraisingDetails),
            success: function (response) {
                $('#referModallId').modal('hide');
                alert("Operation Completed Sucessfully!!!");
                getFundRaisData();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    function updateFundRaiseDetailsInDonerTable() {
        let fundraiseDonorList = [];
        fundraiseDonorList = $scope.viewDonationData.filter(function (obj) {
            return obj.fundraisingDetails.fundraisingId == $scope.fundraisingDetails.fundraisingId;
        })
        fundraiseDonorList.forEach(function (obj) {
            delete obj.fundraisingDetails["$$hashKey"];
            obj.fundraisingDetails = { ...$scope.fundraisingDetails };
            delete obj["$$hashKey"];
            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/donation/" + obj.donationId + ".json",
                data: JSON.stringify(obj),
                success: function (response) {
                    getDonationData();
                }, error: function (error) {
                    //alert("Something went wrong");
                }
            });
        })
    }
    // Campaign Data
    function getCampaignData() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/campaign.json",
            success: function (response) {
                $scope.campaignData = [];
                for (let i in response) {
                    let data = response[i];
                    data["campaignId"] = i;
                    $scope.campaignData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addCampaignData = function () {
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/campaign.json",
            data: JSON.stringify($scope.campaignDetails),
            success: function (response) {
                $('#campaignlId').modal('hide');
                alert("Operation Completed Sucessfully!!!");
                getCampaignData();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.logout = function () {
        window.location = "index.html";
    }
    $(document).ready(function () {
        $(".menu-active-cls").on("click", function () {
            $(".menu-active-cls").removeClass("active");
            $(this).addClass("active");
            let type = $(this).attr("menuType");
            $(".donationCls").hide();
            $(".participateCls").hide();
            $(".referCls").hide();
            $(".campaignCls").hide();
            if (type == "DONATION") {
                $(".donationCls").show();
                getFundRaisData();
                getDonationData();
            } else if (type == "PARTICIPATE") {
                $(".participateCls").show();
                getCampaignData();
                getVolunteersdata();
            } else if (type == "CAMPAIGN") {
                $scope.campaignDetails = {};
                $(".campaignCls").show();
                getCampaignData();
            } else if (type == "REFER") {
                $(".referCls").show();
                getFundRaisData();
            }
        })
        $('#donationModelId').on('hidden.bs.modal', function (e) {
            $scope.donorDetails = {};
        })
        $("#participatelId").on('hidden.bs.modal', function (e) {
            $scope.volunteersDetails = {};
        })
        $("#referModallId").on('hidden.bs.modal', function (e) {
            $scope.fundraisingDetails = {};
            $scope.isEdit = false;
        })
    })
});
