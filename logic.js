const Airtable = require('airtable');
const app = angular.module("myApp", ["ui.bootstrap"]);
app.controller("mainController", ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal){
	window.exposedScope = $scope;
	$scope.sort = "asc";
	$scope.categories = [{value: 0, name:"CATEGORY"}, {value: 1, name:"ANCHOR/EMCEE"},{value: 2, name:"CELEBRITY"}, {value: 3, name:"COMEDIAN"}, {value:4, name:"DANCER/TROUPE"}, {value:5, name:"DJ"}, {value:6, name:"INSTRUMENTALIST"}, {value:7, name:"LIVE BAND"}, {value:8, name:"MAGICIAN"}, {value:9, name:"MAKE-UP ARTIST"}, {value:10, name:"MODEL"}, {value:11, name:"PHOTOGRAPHER"}, {value:12, name:"SINGER"}, {value:13, name:"SPEAKER"}, {value:14, name:"VARIETY ARTIST"}];
	$scope.pagination = {totalItems: 0, itemsPerPage: 10, currentPage: 1};
	$scope.search = {category: 0, city: "", price: ""};
	$scope.artists = [];
	$scope.alerts = [];

	$scope.closeAlert = (index) => {
		if(index < $scope.alerts.length){
			$scope.alerts.splice(index, 1);
		}
	}

	$scope.changeSort = () => {
		if($scope.sort === "asc"){
			$scope.sort = "desc";
		}else{
			$scope.sort = "asc";
		}
		$scope.loadArtists();
	}

	$scope.showTokensModal = () => {
		let instance = $uibModal.open({
	      templateUrl: 'tokensModal.html',
	      backdrop: "static",
	      controller: 'tokensController',
	      size: "sm",
	      resolve: {
	        PIPEDRIVE_TOKEN: () => $scope.PIPEDRIVE_TOKEN,
	        AIRTABLE_TOKEN: () => $scope.AIRTABLE_TOKEN
		  }
		}).result.then(tokens => {
			if(tokens && tokens.pipedriveToken && tokens.airtableToken){
				$scope.AIRTABLE_TOKEN = tokens.airtableToken;
				$scope.PIPEDRIVE_TOKEN = tokens.pipedriveToken;

				if($scope.AIRTABLE_TOKEN){
					$scope.airtable = new Airtable({apiKey: $scope.AIRTABLE_TOKEN}).base("appAOUimmyFijLDUZ");
				}

				Utils.setPipedriveToken(tokens.pipedriveToken);
				Utils.setAirtableToken(tokens.airtableToken);

				$scope.loadDeal();
			}
		});
	}

	$scope.pagination.onPageChange = () => {
		$scope.artistsToShow = $scope.artists.slice(($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage, Math.min($scope.pagination.currentPage * $scope.pagination.itemsPerPage, $scope.artists.length));
	}

	$scope.loadArtists = () => {
		$scope.pagination.loading = true;
		$scope.alerts = $scope.alerts.filter(a => a.type !== "ARTISTS");
		$scope.artists = [];
		$scope.pagination.currentPage = 1;
		$scope.pagination.totalItems = 0;
		$scope.loadMoreArtists = undefined;
		$scope.artistsToShow = [];

		let options = {
						view: "TestView",
		    			fields: ["id", "professionalname", "price", "city", "email", "phone", "subcategory"],
		    			sort: [{field: 'price', direction: $scope.sort}]
		    		}

		let categoryObj = $scope.categories.find(c => c.value != 0 && c.value == $scope.search.category);
		let conditions = [];
		let filterByFormula = "";
		if(categoryObj){
			conditions.push(`FIND("${categoryObj.name.toLowerCase()}", LOWER(category))`);
		}
		if($scope.search.city && $scope.search.city.trim()){
			conditions.push(`FIND("${$scope.search.city.toLowerCase()}", LOWER(city))`);
		}
		if($scope.search.price === 0 || ($scope.search.price && !isNaN($scope.search.price))){
			conditions.push(`price<=${$scope.search.price}`);
		}

		if(conditions.length){
			if(conditions.length === 1){
				filterByFormula = conditions[0];
			}else{
				filterByFormula = `AND(${conditions.join()})`;
			}
		}
		options.filterByFormula = filterByFormula;
		console.log("filter", options.filterByFormula);
		$scope.airtable("ArtistsDev")
		.select(options)
		.eachPage(function(records, fetchNextPage) {
			console.log("artists", records);
			$scope.loadMoreArtists = fetchNextPage;
			$scope.artists.push(...records.map(v => ({...v.fields, rowId: v.fields.id, id: v.id})));
			$scope.artistsToShow = $scope.artists.slice(0, $scope.pagination.itemsPerPage);
			$scope.pagination.totalItems = $scope.artists.length;
			$scope.pagination.loading = false;
			try{
				$scope.$apply();
			}catch(e){
				console.warn(e);
			}
		}, function done(error) {
			console.log("@loadArtists.done", error);
			$scope.loadMoreArtists = undefined;
			if(error){
				$scope.alerts.push({type: "ARTISTS", msg: "Unable to load artists. Make sure the AirTable token is valid."});
			}
			$scope.pagination.loading = false;
			try{
				$scope.$apply();
			}catch(e){
				console.warn(e);
			}
		});
	}


	$scope.loadDeal = () => {
		let loadDeal = () => {
			if($scope.dealId){
				$scope.pagination.loading = true;
				$scope.alerts = $scope.alerts.filter(a => a.type !== "DEAL");
				$http.get(`https://api.pipedrive.com/v1/deals/${$scope.dealId}?api_token=${$scope.PIPEDRIVE_TOKEN}`).then(r => r.data).then(r => r.data).then(data => {
					$scope.search.category = parseInt(data["61a501536a4065f5a970be5c6de536cf7ad14078"]);
					$scope.search.price = data.value;
					$scope.search.city = data["361085abd375a7eb3964f068295f12fe17d9f280_admin_area_level_2"];
					$scope.loadArtists();
					$scope.pagination.loading = false;
				}).catch(e => {
					$scope.pagination.loading = false;
					$scope.alerts.push({type:"DEAL", msg: `Unable to get deal "${$scope.dealId}" details. Make sure the PipeDrive token is valid.`});
				});
			}else{
				$scope.loadArtists();
			}
		}
		if(window.chrome && window.chrome.tabs){
			chrome.tabs.query({'active': true}, tabs => {
				if(tabs && tabs.length && tabs[0].url && /starclinch\.pipedrive\.com\/deal\/\d+/.test(tabs[0].url)){
					$scope.$apply(() => {
						$scope.dealId = tabs[0].url.match(/deal\/(\d+)/)[1];
						loadDeal();
					});
				}else{
					loadDeal();
				}
			});
		}else{
			loadDeal();
		}
	}

	Utils.getPipedriveToken(token => {
		$scope.PIPEDRIVE_TOKEN = token;
		Utils.getAirtableToken(token => {
			$scope.AIRTABLE_TOKEN = token;

			if($scope.AIRTABLE_TOKEN){
				$scope.airtable = new Airtable({apiKey: $scope.AIRTABLE_TOKEN}).base("appAOUimmyFijLDUZ");
			}

			if($scope.PIPEDRIVE_TOKEN && $scope.AIRTABLE_TOKEN){
				$scope.loadDeal();				
			}else{
				$scope.showTokensModal();
			}
		});
	});

	$scope.submitArtists = () => {
		let emails = $scope.artists.filter(a => a.checked).map(a => a.email);
		console.log(emails);
	}

}]);

app.controller("tokensController", ["$scope", "$uibModalInstance", "PIPEDRIVE_TOKEN", "AIRTABLE_TOKEN", function($scope, $uibModalInstance, PIPEDRIVE_TOKEN, AIRTABLE_TOKEN){
	$scope.local = {pipedriveToken: PIPEDRIVE_TOKEN, airtableToken: AIRTABLE_TOKEN, pipedriveTokenHasError: false, airtableTokenHasError: false};
	if(!$scope.local.pipedriveToken){
		Utils.getTempPipedriveToken(token => {
			$scope.local.pipedriveToken = token;
		})
	}
	if(!$scope.local.airtableToken){
		Utils.getTempAirtableToken(token => {
			$scope.local.airtableToken = token;
		});
	}
	$scope.local.setPipedriveToken = () => {
		Utils.setTempPipedriveToken($scope.local.pipedriveToken);
	}
	$scope.local.setAirtableToken = () => {
		Utils.setTempAirtableToken($scope.local.airtableToken);
	}
	$scope.local.save = () => {
		if($scope.local.pipedriveToken && $scope.local.airtableToken){
			$uibModalInstance.close({pipedriveToken: $scope.local.pipedriveToken, airtableToken: $scope.local.airtableToken});
		}else{
			if(!$scope.local.pipedriveToken){
				$scope.local.pipedriveTokenHasError = true;
			}
			if(!$scope.local.airtableToken){
				$scope.local.airtableTokenHasError = true;
			}
		}
	}
}]);
