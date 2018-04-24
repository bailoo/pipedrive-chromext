const Airtable = require('airtable');
const app = angular.module("myApp", ["ui.bootstrap"]);

app.controller("mainController", ["$scope", "$http", "$uibModal", "$timeout", function($scope, $http, $uibModal, $timeout){
	window.exposedScope = $scope;
	$scope.categories = [{value: 0, name:"ANY CATEGORY"}, {value: 1, name:"ANCHOR/EMCEE"},{value: 2, name:"CELEBRITY"}, {value: 3, name:"COMEDIAN"}, {value:4, name:"DANCER/TROUPE"}, {value:5, name:"DJ"}, {value:6, name:"INSTRUMENTALIST"}, {value:7, name:"LIVE BAND"}, {value:8, name:"MAGICIAN"}, {value:9, name:"MAKE-UP ARTIST"}, {value:10, name:"MODEL"}, {value:11, name:"PHOTOGRAPHER"}, {value:12, name:"SINGER"}, {value:13, name:"SPEAKER"}, {value:14, name:"VARIETY ARTIST"}];
	$scope.pagination = {totalItems: 0, itemsPerPage: 10, currentPage: 1};
	$scope.search = {name: "", category: 0, city: "", price: "",gender: "Any Gender", subcategory: "Any Subcategory", subscription: "Any Subscription", language: "Any Language",   event: 0, clientname: "", dealowner: "", gathering: "", date: "", lookingfor: "", json: ""};
	$scope.sorting = {price: "asc", updated: "asc"};
	$scope.event = [{value: 15, name:"Campus"}, {value: 16, name:"Charity"},{value: 18, name:"Corporate"}, {value: 19, name:"Exhibition"}, {value: 20, name:"Fashion Show"}, {value: 21, name:"Inauguration"}, {value: 22, name:"Kids Party"}, {value: 23, name:"Photo/Video Shoot"}, {value: 24, name:"Private Party"}, {value: 25, name:"Professional Hiring"}, {value: 26, name:"Religious"}, {value: 27, name:"Restaurant"}, {value: 28, name:"Wedding"}, {value: 17, name:"Concert/Festival"}];
	$scope.artists = [];
	$scope.alerts = [];
	$scope.submit = {includePrice: false}

	$scope.subcategoriesMap = {1: ["Any Subcategory", "Anchor/Emcee","Anchor","Emcee","Voice over Artist", "Radio Jockey"], 2:["Any Subcategory","Celebrity", "Film Stars", "Sports Celebrities","TV Personalities","Pageant Winner"], 3: ["Any Subcategory","Comedian","Stand Up","Impersonators","Mimicry","Reality Show Comedians"], 4: ["Any Subcategory","Dancer/Troupe","Belly Dancers","Exotic Dancers","Bhangra","Bollywood","Choreographers","Indian Classical","Kids Troupe","Folk","Religious","Reality Show Dancers","Western"], 5: ["Any Subcategory","DJ","Techno","EDM","Trance","Bollywood","Rock","Dubstep","Deep House","Minimal", "VDJ","Electro","Progressive","Psychedelic","Trap","Bass"], 6:["Any Subcategory","Instrumentalist","Guitarist","Percussionist","Flutist","Pianist","Saxophonist","Keyboardist","Violinist","Indian Classical Instruments","One-man band"],7: ["Any Subcategory","Live Band","Sufi","Bollywood","Rock","Fusion","Pop","Jazz","Metal","Orchestra","Blues","Folk","Indie","Tribute","Alternative","Punk","Funk","Progressive","Psychedelic","Electronica","Rock n Roll","Reggae","Rap","Hip Hop"], 8: ["Any Subcategory","Magician","Stage Magicians","Illusionist","Close up Magicians","Hypnotist","Mind Reader"], 9: ["Any Subcategory","Make-up Artist","Fashion","Bridals & Parties","Film & Television","Wardrobe Stylist","Fashion Choreographer"], 10:["Any Subcategory","Model","Runway Models","Catalogue Models","Commercial Models","Glamour Models","Art Models","Promotional Models","Foreign Models","International Models"], 11: ["Any Subcategory","Photographer","Wedding","Baby","Candid","Concept","Corporate Films","Documentary Films","Events","Fashion","Short Films","Portfolio","Weddings","Portrait","Product"],12:["Any Subcategory","Singer","Bollywood","Classical","English Retro","Ghazal","Hindi Retro","Indian Folk","Karaoke","Qawwali","Religious","Acoustic Singer","Rapper"],13: ["Any Subcategory","Speaker","Motivational","Vocational","Spiritual","Training"],14: ["Any Subcategory","Variety Artist","Acrobat Artists","Balloon Artists","Bartenders","Caricaturists","Painters","Fire Artists","Jugglers","Mehendi Artists","Puppeteers","Stilt Walkers","Stunt Artists","Shadow Artists","Sand Artists","Whistler","Beatboxer"]};
	$scope.subcategories = ["Any Subcategory"];

	$scope.genders = ["Any Gender", "Male", "Female", "Others"];
	$scope.subscriptions = ["Any Subscription", "Get Discovered", "Instant Gigs", "Power Up"];
	$scope.languages = ["Any Language", "English","Hindi","Punjabi","Gujarati","Bengali","Malayalam","Marathi","Tamil","Telugu","Kannada","Assamese","Rajasthani"];

	$scope.categoryChange = function(){
		if($scope.subcategoriesMap[$scope.search.category]){
			$scope.subcategories = $scope.subcategoriesMap[$scope.search.category]
		}else{
		 	$scope.subcategories = ["Any Subcategory"];
		 	$scope.search.subcategory = "Any Subcategory";
		}
	}

	$scope.closeAlert = (index) => {
		if(index < $scope.alerts.length){
			$scope.alerts.splice(index, 1);
		}
	}

	$scope.changeSorting = (key) => {
		if($scope.sorting[key] === "asc"){
			$scope.sorting[key] = "desc";
		}else{
			$scope.sorting[key] = "asc";
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
		$scope.saveState();
	}

	$scope.loadArtists = state => {
		$scope.pagination.loading = true;
		$scope.alerts = $scope.alerts.filter(a => a.type !== "ARTISTS");
		$scope.artists = [];
		$scope.pagination.currentPage = 1;
		$scope.pagination.totalItems = 0;
		$scope.loadMoreArtists = undefined;
		$scope.artistsToShow = [];

		let options = {
						view: "TestView",
		    			fields: ["id", "professionalname", "price", "city", "email", "phone", "subcategory", "url", "thumbnail", "updated"],
		    			sort: [{field: "price", direction: $scope.sorting.price}, {field: "updated", direction: $scope.sorting.updated}]
		    		}

		let categoryObj = $scope.categories.find(c => c.value != 0 && c.value == $scope.search.category);
		let conditions = [];
		let filterByFormula = "";

		if($scope.search.name){
			conditions.push(`FIND("${$scope.search.name.toLowerCase()}", LOWER(professionalname))`)
		}

		if(categoryObj){
			conditions.push(`FIND("${categoryObj.name.toLowerCase()}", LOWER(category))`);
		}
		if($scope.search.city && $scope.search.city.trim()){
			conditions.push(`FIND("${$scope.search.city.toLowerCase()}", LOWER(city))`);
		}
		if($scope.search.price === 0 || ($scope.search.price && !isNaN($scope.search.price))){
			conditions.push(`price<=${$scope.search.price}`);
		}

		if($scope.search.gender && $scope.search.gender !== "Any Gender"){
			conditions.push(`FIND("${$scope.search.gender.toLowerCase()}", LOWER(gender))`)
		}

		if($scope.search.subcategory && $scope.search.subcategory !== "Any Subcategory"){
			conditions.push(`FIND("${$scope.search.subcategory.toLowerCase()}", LOWER(subcategory))`)
		}

		if($scope.search.subscription && $scope.search.subscription !== "Any Subscription"){
			conditions.push(`FIND("${$scope.search.subscription.toLowerCase()}", LOWER(subscription))`)
		}

		if($scope.search.language && $scope.search.language !== "Any Language"){
			conditions.push(`FIND("${$scope.search.language.toLowerCase()}", LOWER(language))`)
		}

		if(conditions.length){
			if(conditions.length === 1){
				filterByFormula = conditions[0];
			}else{
				filterByFormula = `AND(${conditions.join()})`;
			}
		}
		options.filterByFormula = filterByFormula;
		$scope.airtable("ArtistsDev")
		.select(options)
		.eachPage(function(records, fetchNextPage) {
			$timeout(() => {
				$scope.loadMoreArtists = fetchNextPage;
				$scope.artists.push(...records.map(v => {
					let artist = {...v.fields, rowId: v.fields.id, id: v.id};
					if(state && state.artists){
						artist.checked = (state.artists.find(a => a.id === artist.id) || {}).checked;
					}
					return artist;
				}));

				let start = 0;
				let end = $scope.itemsPerPage;
				if(state && state.currentPage && ((state.currentPage - 1) * $scope.pagination.itemsPerPage) < $scope.artists.length){
					$scope.pagination.currentPage = state.currentPage;
					start = (state.currentPage - 1) * $scope.pagination.itemsPerPage;
					end = Math.min($scope.artists.length, state.currentPage * $scope.pagination.itemsPerPage);
				}
				if(state && state.artists && $scope.artists.length < state.artists.length && $scope.loadMoreArtists){
					$scope.loadMoreArtists();
				}

				$scope.artistsToShow = $scope.artists.slice(start, end);
				$scope.pagination.totalItems = $scope.artists.length;
				$scope.pagination.loading = false;
				if(!state){
					$scope.saveState();
				}
			});
		}, function done(error) {
			$timeout(() => {
				$scope.loadMoreArtists = undefined;
				if(error){
					$scope.alerts.push({type: "ARTISTS", msg: "Unable to load artists. Make sure the AirTable token is valid."});
				}
				$scope.pagination.loading = false;
			});
		});
	}


	$scope.loadDeal = dealId => {
		let loadDeal = () => {
			if($scope.dealId){
				$scope.pagination.loading = true;
				$scope.alerts = $scope.alerts.filter(a => a.type !== "DEAL");
				$http.get(`https://api.pipedrive.com/v1/deals/${$scope.dealId}?api_token=${$scope.PIPEDRIVE_TOKEN}`).then(r => r.data).then(r => r.data).then(data => {
					$scope.search.category = parseInt(data["61a501536a4065f5a970be5c6de536cf7ad14078"]);
					$scope.search.event = parseInt(data["755ded0be98b3ee5157cf117566f0443bd93cc63"]);
					$scope.search.price = data.value;
					$scope.search.city = data["361085abd375a7eb3964f068295f12fe17d9f280_admin_area_level_2"];
					$scope.search.name = data["ef1b3ca0c720a4c39ddf75adbc38ab4f8248597b"];
					$scope.search.gathering = data["1f9805fdb8715d773f1fc9457545b49c5b05d058"];
					$scope.search.date = data["19c2c12d8fea52c4709cd4ce256b7852bc2b0259"];
					$scope.search.lookingfor = data["ef1b3ca0c720a4c39ddf75adbc38ab4f8248597b"];
					$scope.search.clientname = data["person_name"];
					$scope.search.dealowner = data["owner_name"];
					$scope.search.json = data;
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
		
		if(dealId){
			$scope.dealId = dealId;
			loadDeal();
		}else{
			Utils.getDealId(dealId => {
				$timeout(() => {
					$scope.dealId = dealId;
					loadDeal();
				});
			});
		}
	}

	Utils.getPipedriveToken(token => {
		$timeout(() => {
			$scope.PIPEDRIVE_TOKEN = token;
		});
		Utils.getAirtableToken(token => {
			$timeout(() => {
				$scope.AIRTABLE_TOKEN = token;

				if($scope.AIRTABLE_TOKEN){
					$scope.airtable = new Airtable({apiKey: $scope.AIRTABLE_TOKEN}).base("appAOUimmyFijLDUZ");
				}

				if($scope.PIPEDRIVE_TOKEN && $scope.AIRTABLE_TOKEN){
					//$scope.loadDeal();
					Utils.getDealId(dealId => {
						Utils.getState(state => {
							$timeout(() => {
								if(state){
									if(state.search){
										$scope.search = state.search;
										$scope.categoryChange();
										$scope.search.subcategory = state.search.subcategory;
									}
									if(state.sorting){
										$scope.sorting = state.sorting;
									}
									$scope.dealId = dealId;
									$scope.submit.includePrice = state.includePrice;
								}
								$scope.loadArtists(state);
							});
						});
					});
				}else{
					$scope.showTokensModal();
				}
			});
		});
	});

	$scope.submitArtists = () => {
		let artists = $scope.artists.filter(a => a.checked).map(a => a.id);
		let categoryName = ($scope.categories.find(c => c.value == $scope.search.category) || {}).name
		let eventName = ($scope.event.find(e => e.value == $scope.search.event) || {}).name
		let artistQuery = `OR(${artists.map(id => ("RECORD_ID()='" + id + "'")).join()})`;

		let json = {
			fields:{
				dealid: parseInt($scope.dealId),
				includeprice: ($scope.submit.includePrice ? 1 : 0),
				artists,
				category: $scope.search.category,
				categoryname: categoryName,
				eventname: eventName,
				city: $scope.search.city,
				price: $scope.search.price,
				gathering: $scope.search.gathering,
				date: $scope.search.date,
				lookingfor: $scope.search.lookingfor,
				clientname: $scope.search.clientname,
				dealowner: $scope.search.dealowner,
				artistquery: artistQuery,
				json: JSON.stringify($scope.search.json)
			}
		}

		$http({
			method: "POST",
			url: "https://api.airtable.com/v0/appAOUimmyFijLDUZ/ArtistSuggest",
			headers: {
				"Authorization": `Bearer ${$scope.AIRTABLE_TOKEN}`
			},
			data: json
		}).then(response => {
			console.info("Artists were posted", response);
		}).catch(e => {
			console.warn("Unable to posts checked artists", e);
			$scope.alerts.push({type: "ARTISTS", msg: "Unable to POST selected artists"});
		});
		
	}

	$scope.saveState = () => {
		let state = {artists: $scope.artists.map(a => ({id: a.id, checked: a.checked})), currentPage: $scope.pagination.currentPage, search: $scope.search, sorting: $scope.sorting, includePrice: $scope.submit.includePrice};
		Utils.setState(state);
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