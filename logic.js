var app = angular.module("myApp", ["ui.bootstrap"]);
app.controller("mainController", ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal){
	$scope.tst = "Working";

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
			console.log(tokens);
			if(tokens && tokens.pipedriveToken && tokens.airtableToken){
				$scope.AIRTABLE_TOKEN = tokens.pipedriveToken;
				$scope.PIPEDRIVE_TOKEN = tokens.airtableToken;
				Utils.setPipedriveToken(tokens.pipedriveToken);
				Utils.setAirtableToken(tokens.airtableToken);
			}
		});
	}

	Utils.getPipedriveToken(token => {
		$scope.PIPEDRIVE_TOKEN = token;
		Utils.getAirtableToken(token => {
			$scope.AIRTABLE_TOKEN = token;
			if(!($scope.PIPEDRIVE_TOKEN && $scope.AIRTABLE_TOKEN)){
				$scope.showTokensModal();
			}
		});
	});

}]);

app.controller("tokensController", ["$scope", "$uibModalInstance", function($scope, $uibModalInstance, PIPEDRIVE_TOKEN, AIRTABLE_TOKEN){
	$scope.local = {pipedriveToken: PIPEDRIVE_TOKEN, airtableToken: AIRTABLE_TOKEN, pipedriveTokenHasError: false, airtableTokenHasError: false};
	console.log($scope.local);
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