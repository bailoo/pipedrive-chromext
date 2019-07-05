const Airtable = require('airtable');
const app = angular.module("myApp", ["ui.bootstrap"]);
const DEFAULE_SEARCH_PARAMS = {name: "", category: 1, city: "", price: "",gender: "Any Gender", subcategory: "Any Subcategory", subscription: "Any Subscription", language: "Any Language",   event: 0, clientname: "", clientemail:"", dealowner: "", gathering: "", date: "", lookingfor: "", json: "", state: ""};
category_id={"anchor/emcee":112, "anchor":13967, "emcee":13968, "voice over artist":13975, "radio jockey":14087, "celebrity":32, "film stars":13812, "sports celebrities":14464, "tv personalities":13813, "pageant winner":13959, "comedian":21, "stand up":13977, "impersonators":13986, "mimicry":13987, "reality show comedians":13988, "dancer/troupe":87, "belly dancers":13924, "exotic dancers":13925, "bhangra":13911, "bollywood":13912, "choreographers":13913, "indian classical":13926, "kids troupe":13927, "folk":13914, "religious":13916, "reality show dancers":13915, "western":13917, "dj":56, "techno":13882, "edm":13849, "trance":13851, "bollywood":13846, "rock":13850, "dubstep":13848, "deep house":13847, "minimal":13908, "vdj":16243, "electro":13854, "progressive":13855, "psychedelic":13921, "trap":13883, "bass":13940, "instrumentalist":46, "guitarist":14044, "percussionist":14078, "flutist":14489, "pianist":14054, "saxophonist":14057, "keyboardist":13821, "violinist":14063, "indian classical instruments":14065, "one-man band":14045, "live band":35, "sufi":17317, "bollywood":13902, "rock":239, "fusion":247, "pop":13794, "jazz":13890, "metal":248, "orchestra":13826, "blues":13809, "folk":13818, "indie":238, "tribute":240, "alternative":13793, "punk":13876, "funk":13830, "progressive":13795, "psychedelic":13796, "electronica":13903, "rock n roll":13831, "reggae":13810, "rap":14031, "hip hop":14159, "magician":120, "stage magicians":14022, "illusionist":14021, "close up magicians":14020, "hypnotist":14233, "mind reader":14073, "make-up artist":65, "fashion":13861, "bridals & parties":13860, "film & television":13931, "wardrobe stylist":14142, "fashion choreographer":14132, "model":105, "runway models":13953, "catalogue models":13948, "commercial models":13949, "glamour models":13950, "art models":13982, "promotional models":13952, "foreign models":13983, "international models":14207, "photo/videographer":68, "weddings":13873, "baby":13866, "candid":13867, "concept":13868, "corporate films":13895, "documentary films":13886, "events":13869, "fashion":13861, "short films":14030, "portfolio":13870, "portrait":13871, "product":13872, "singer":26, "bollywood":13790, "classical":13981, "english retro":13842, "ghazal":14058, "hindi retro":13944, "indian folk":13971, "karaoke":14016, "qawwali":14150, "religious":14062, "acoustic singer":13789, "rapper":13933, "speaker":142, "motivational":14216, "vocational":14729, "spiritual":15275, "training":14311, "variety artist":102, "acrobat artists":14244, "balloon artists":14245, "bartenders":14313, "caricaturists":14246, "painters":13936, "fire artists":14247, "jugglers":14248, "mehendi artists":14002, "puppeteers":14249, "stunt artists":14645, "shadow artists":14293, "sand artists":14604, "whistler":16261, "beatboxer":14624}
city_id={14337: 'Bhubaneswar', 14850: 'Durgapur', 15019: 'Muktsar', 13829: 'Panaji', 14855: 'Bardhaman', 15368: 'Khanna', 15881: 'Bulandshahr', 13836: 'Margao', 14349: 'Allahabad', 13838: 'Nagpur', 14864: 'Manali', 13841: 'Bangalore', 16402: 'Darbhanga', 14867: 'Chandrapur', 13845: 'Hyderabad', 16406: 'Yamunanagar', 16408: 'Tiruppur', 15385: 'Amravati', 16411: 'Beawar', 15391: 'Etawah', 13857: 'Darjeeling', 16420: 'Dhule', 16422: 'Kanhangad', 16424: 'Ahmadnagar', 16428: 'Jamalpur', 14344: 'Udupi', 16367: 'Nagar Haveli', 14900: 'Jalgaon', 15413: 'Hoshiarpur', 16439: 'Dohad', 14907: 'Saharanpur', 14398: 'Dhanbad', 16447: 'Koch Bihar', 13888: 'Ranchi', 14915: 'Latur', 15940: 'Bangaon', 14406: 'Meerut', 15944: 'Anantapur', 16396: 'Muzaffarpur', 13899: 'Kanpur', 14415: 'Aurangabad', 13904: 'Shimla', 14424: 'Gwalior', 14938: 'Silchar', 16370: 'Katihar', 14440: 'Jabalpur', 14956: 'Kapurthala', 15378: 'Sonipat', 14355: 'Udaipur', 14966: 'Raurkela', 13943: 'Kota', 14969: 'Panchkula', 16002: 'Ambur', 13955: 'Lucknow', 15494: 'Rishikesh', 15496: 'Sultanpur', 13964: 'Ahmedabad', 14480: 'Amritsar', 14053: 'Mathura', 16023: 'Neyveli', 14633: 'Navi Mumbai Panvel Raigad', 15012: 'Kozhikode', 14501: 'Phagwara', 15014: 'Moga', 15531: 'Bilaspur', 13996: 'Karnal', 13998: 'Jalandhar', 14512: 'Sangali', 15537: 'Vidisha', 14037: 'Surat', 16053: 'Malappuram', 15030: 'Baleshwar', 15033: 'Firozpur', 16159: 'Kaithal', 14013: 'Ludhiana', 14526: 'Gangtok', 15040: 'Gorakhpur', 16065: 'Aligarh', 14019: 'Bhopal', 15788: 'Pathankot', 15046: 'Haridwar', 14881: 'Ujjain', 14537: 'Varanasi', 15223: 'Kasauli', 14542: 'Ambala', 14546: 'Thiruvananthapuram', 15572: 'Hisar', 14549: 'Kottayam', 14936: 'Jorhat', 15064: 'Anand', 14043: 'Agartala', 14714: 'Siliguri', 14559: 'Panvel', 14050: 'Raipur', 229: 'NCR / Delhi', 15077: 'Dibrugarh', 14566: 'Mormugao', 15082: 'Barnala', 15942: 'Purnea', 14005: 'Mysore', 14578: 'Jamshedpur', 16115: 'Warangal', 244: 'New Delhi', 15093: 'Nanded', 15145: 'Kollam', 14584: 'Vellore', 14586: 'Baharampur', 15250: 'Panipat', 15103: 'Ghazipur', 15616: 'Siwan', 14082: 'Durg-Bhilainagar', 14600: 'Tiruchirappalli', 16138: 'Begusarai', 14551: 'Madurai', 15490: 'Dharamshala', 14040: 'Jaipur', 14098: 'Jammu', 14101: 'Jodhpur', 15126: 'Gulbarga', 14107: 'Dimapur', 14621: 'Achalpur', 14111: 'Guwahati', 14113: 'Rajapalayam', 15579: 'Gandhidham', 15141: 'Anjaw', 14119: 'Thrissur', 14121: 'Indore', 16172: 'Raigarh', 15662: 'Kumbakonam', 14387: 'Rajkot', 15161: 'Tezpur', 14047: 'Shillong', 14654: 'Bijnor', 15679: 'Deoghar', 15683: 'Ganganagar', 15685: 'Ajmer', 14663: 'Srinagar', 15244: 'Batala', 14154: 'Tura', 14668: 'Jalpaiguri', 14733: 'Vapi', 14161: 'Vadodara', 14164: 'Visakhapatnam', 16213: 'Bhagalpur', 14166: 'Imphal', 14171: 'Agra', 14687: 'Chamba', 14689: 'Nagercoil', 14694: 'Rohtak', 14226: 'Palwal', 14702: 'Karbi Anglong', 14191: 'Udhagamandalam', 14196: 'Bareilly', 14709: 'Puducherry', 14199: 'Bathinda', 15226: 'Hubli-Dharwad', 16451: 'Maunath Bhanjan', 15885: 'Cuttack', 14721: 'Kothamangalam', 15236: 'Coimbatore', 13891: 'Pune', 15255: 'Jhunjhunu', 16268: 'Guna', 15757: 'Godhra', 16273: 'Chhapra', 14738: 'Alipurduar', 15171: 'Haldwani-Kathgodam', 16279: 'Bikaner', 16283: 'Chandausi', 15773: 'Balurghat', 14750: 'Palakkad', 14757: 'Belgaum', 16295: 'Asansol', 14252: 'Aizawl', 16301: 'Jamnagar', 13896: 'Mangalore', 16306: 'Porbandar', 14259: 'Papum Pare', 16309: 'Kharagpur', 13807: 'Mumbai', 14268: 'Dehradun', 16320: 'Daman', 14273: 'Patiala', 14789: 'Roorkee', 16326: 'Giridih', 14279: 'Kolhapur', 15816: 'Tawang', 14282: 'Alwar', 14799: 'Bhiwani', 16336: 'Prakasam', 13825: 'Chandigarh', 16342: 'Kasaragod', 14295: 'S.A.S. Nagar', 15321: 'Chittoor', 16346: 'Rewari', 15323: 'Puri Town', 17372: 'Moradabad', 14302: 'Patna', 14815: 'Hajipur', 13792: 'Chennai', 16353: 'Port Blair', 15842: 'Gondiya', 16355: 'Bellary', 16357: 'Azamgarh', 15846: 'Rudrapur', 15335: 'Nagaon', 13800: 'Kolkata', 14825: 'Nashik', 14759: 'Sagar', 13805: 'Solan', 14845: 'Ichalkaranji', 14834: 'Bokaro Steel City', 14329: 'Alappuzha', 14842: 'Purulia', 13820: 'Kochi', 16381: 'Churu', 14847: 'Kannur'}
city_id_reverse={'Ahmadnagar': 16424, 'Roorkee': 14789, 'Gondiya': 15842, 'Mysore': 14005, 'Chamba': 14687, 'Rohtak': 14694, 'Ambur': 16002, 'Nanded': 15093, 'Jalandhar': 13998, 'Moga': 15014, 'Baharampur': 14586, 'Durg-Bhilainagar': 14082, 'Meerut': 14406, 'Kasauli': 15223, 'Tezpur': 15161, 'Kaithal': 16159, 'Chennai': 13792, 'Jammu': 14098, 'Solan': 13805, 'Deoghar': 15679, 'Khanna': 15368, 'Mathura': 14053, 'Chandrapur': 14867, 'Hisar': 15572, 'Kochi': 13820, 'Muktsar': 15019, 'Srinagar': 14663, 'Panchkula': 14969, 'Sultanpur': 15496, 'Bellary': 16355, 'Pune': 13891, 'Agra': 14171, 'Dohad': 16439, 'Darjeeling': 13857, 'Kharagpur': 16309, 'Nagpur': 13838, 'Gwalior': 14424, 'Saharanpur': 14907, 'Port Blair': 16353, 'Darbhanga': 16402, 'Bikaner': 16279, 'Vellore': 14584, 'Phagwara': 14501, 'Surat': 14037, 'Hoshiarpur': 15413, 'Karbi Anglong': 14702, 'Pathankot': 15788, 'Firozpur': 15033, 'Tura': 14154, 'Prakasam': 16336, 'Kanpur': 13899, 'Agartala': 14043, 'Tiruchirappalli': 14600, 'Chhapra': 16273, 'Ujjain': 14881, 'Achalpur': 14621, 'Kottayam': 14549, 'Visakhapatnam': 14164, 'Sagar': 14759, 'Kannur': 14847, 'Sonipat': 15378, 'Durgapur': 14850, 'Bardhaman': 14855, 'Ganganagar': 15683, 'Nagaon': 15335, 'Giridih': 16326, 'Shillong': 14047, 'Amritsar': 14480, 'Jalpaiguri': 14668, 'Dimapur': 14107, 'Haldwani-Kathgodam': 15171, 'Coimbatore': 15236, 'Gangtok': 14526, 'Purulia': 14842, 'Ludhiana': 14013, 'Rajkot': 14387, 'Muzaffarpur': 16396, 'Rajapalayam': 14113, 'Karnal': 13996, 'Amravati': 15385, 'Chittoor': 15321, 'Bhopal': 14019, 'Batala': 15244, 'Bangalore': 13841, 'Anantapur': 15944, 'Lucknow': 13955, 'Koch Bihar': 16447, 'Bijnor': 14654, 'Cuttack': 15885, 'Alappuzha': 14329, 'Siliguri': 14714, 'Godhra': 15757, 'Kolhapur': 14279, 'Mormugao': 14566, 'New Delhi': 244, 'Ichalkaranji': 14845, 'Vapi': 14733, 'Gorakhpur': 15040, 'Hubli-Dharwad': 15226, 'Jamnagar': 16301, 'Haridwar': 15046, 'Moradabad': 17372, 'Nashik': 14825, 'Anand': 15064, 'Panvel': 14559, 'Dharamshala': 15490, 'Aizawl': 14252, 'Bulandshahr': 15881, 'Dhanbad': 14398, 'Barnala': 15082, 'Asansol': 16295, 'Tiruppur': 16408, 'Varanasi': 14537, 'Raurkela': 14966, 'Vadodara': 14161, 'Guna': 16268, 'Raigarh': 16172, 'Ambala': 14542, 'Patna': 14302, 'Bareilly': 14196, 'Nagercoil': 14689, 'Ranchi': 13888, 'Gulbarga': 15126, 'Dibrugarh': 15077, 'Balurghat': 15773, 'Shimla': 13904, 'Alipurduar': 14738, 'Kasaragod': 16342, 'Purnea': 15942, 'Jorhat': 14936, 'Gandhidham': 15579, 'Allahabad': 14349, 'Udupi': 14344, 'Katihar': 16370, 'NCR / Delhi': 229, 'Anjaw': 15141, 'Hyderabad': 13845, 'Begusarai': 16138, 'Udhagamandalam': 14191, 'Panipat': 15250, 'Belgaum': 14757, 'Aurangabad': 14415, 'Papum Pare': 14259, 'Rewari': 16346, 'S.A.S. Nagar': 14295, 'Imphal': 14166, 'Mangalore': 13896, 'Patiala': 14273, 'Churu': 16381, 'Puducherry': 14709, 'Madurai': 14551, 'Puri Town': 15323, 'Tawang': 15816, 'Silchar': 14938, 'Ahmedabad': 13964, 'Jamalpur': 16428, 'Dehradun': 14268, 'Nagar Haveli': 16367, 'Kozhikode': 15012, 'Beawar': 16411, 'Etawah': 15391, 'Bhiwani': 14799, 'Mumbai': 13807, 'Kapurthala': 14956, 'Guwahati': 14111, 'Neyveli': 16023, 'Kollam': 15145, 'Indore': 14121, 'Jodhpur': 14101, 'Kanhangad': 16422, 'Vidisha': 15537, 'Warangal': 16115, 'Sangali': 14512, 'Ajmer': 15685, 'Raipur': 14050, 'Kolkata': 13800, 'Dhule': 16420, 'Jaipur': 14040, 'Udaipur': 14355, 'Alwar': 14282, 'Thrissur': 14119, 'Kota': 13943, 'Chandigarh': 13825, 'Navi Mumbai Panvel Raigad': 14633, 'Hajipur': 14815, 'Bokaro Steel City': 14834, 'Jabalpur': 14440, 'Jhunjhunu': 15255, 'Bhagalpur': 16213, 'Porbandar': 16306, 'Palwal': 14226, 'Maunath Bhanjan': 16451, 'Rudrapur': 15846, 'Kumbakonam': 15662, 'Bhubaneswar': 14337, 'Jalgaon': 14900, 'Chandausi': 16283, 'Azamgarh': 16357, 'Panaji': 13829, 'Bilaspur': 15531, 'Malappuram': 16053, 'Manali': 14864, 'Bathinda': 14199, 'Bangaon': 15940, 'Kothamangalam': 14721, 'Palakkad': 14750, 'Rishikesh': 15494, 'Baleshwar': 15030, 'Thiruvananthapuram': 14546, 'Jamshedpur': 14578, 'Margao': 13836, 'Daman': 16320, 'Siwan': 15616, 'Aligarh': 16065, 'Latur': 14915, 'Yamunanagar': 16406, 'Ghazipur': 15103}
gender_id={"Male": 18536, "Female": 18537, "Others": 18976}
subscription_id={"StarClinch Black": 18497, "StarClinch Gold": 18498, "StarClinch Plus": 18499}
language_id={"English": 223, "Hindi": 224, "Punjabi": 13884, "Gujarati": 13973, "Bengali": 13816, "Malayalam": 13819, "Marathi": 13962, "Tamil": 13877, "Telugu": 14008, "Kannada": 13938, "Assamese": 14371,"Rajasthani": 13942}
state_id={'Haryana': 18510, 'Punjab': 18524, 'Goa': 18508, 'Chhattisgarh': 18506, 'Kerala': 18515, 'Daman and Diu': 18533, 'Andaman and Nicobar': 18534, 'Bihar': 18504, 'Tamil Nadu': 18527, 'Chandigarh': 18505, 'Jammu and Kashmir': 18512, 'Jharkhand': 18513, 'Meghalaya': 18519, 'Delhi': 18507, 'Assam': 18503, 'Madhya Pradesh': 18516, 'Manipur': 18518, 'Dadar and Nagar Haveli': 18535, 'Sikkim': 18526, 'West Bengal': 18532, 'Uttarakhand': 18530, 'Andhra Pradesh': 18501, 'Himachal Pradesh': 18511, 'Rajasthan': 18525, 'Nagaland': 18521, 'Gujarat': 18509, 'Arunachal Pradesh': 18502, 'Maharashtra': 18517, 'Tripura': 18529, 'Telangana': 18528, 'Puducherry': 18523, 'Karnataka': 18514, 'Mizoram': 18520, 'Odisha': 18522, 'Uttar Pradesh': 18531}

app.controller("mainController", ["$scope", "$http", "$uibModal", "$timeout", function($scope, $http, $uibModal, $timeout){
	window.exposedScope = $scope;
	$scope.subscriptionColors = {"Power Up": "#ffc20e", "Get Discovered": "#37c2a8", "Instant Gigs": "#f57171", "No Subscription": "#eff0f1", "": "#eff0f1"};
	$scope.categories = [{value: 1, name:"ANCHOR/EMCEE"},{value: 2, name:"CELEBRITY"}, {value: 3, name:"COMEDIAN"}, {value:4, name:"DANCER/TROUPE"}, {value:5, name:"DJ"}, {value:6, name:"INSTRUMENTALIST"}, {value:7, name:"LIVE BAND"}, {value:8, name:"MAGICIAN"}, {value:9, name:"MAKE-UP ARTIST"}, {value:10, name:"MODEL"}, {value:11, name:"PHOTO/VIDEOGRAPHER"}, {value:12, name:"SINGER"}, {value:13, name:"SPEAKER"}, {value:14, name:"VARIETY ARTIST"}];
	$scope.pagination = {totalItems: 0, itemsPerPage: 10, currentPage: 1};
	$scope.search = {...DEFAULE_SEARCH_PARAMS};
	$scope.sorting = {price: "asc", updated: "asc", order: ["price", "updated"]};
	$scope.event = [{value:'', name:'Any Event'}, {value: 230, name:"campus"}, {value: 231, name:"charity"}, {value: 232, name:"concertfestival"}, {value: 233, name:"corporate"}, {value: 13811, name:"exhibition"}, {value: 13859, name:"fashionshow"}, {value: 234, name:"inauguration"}, {value: 235, name:"kidsparty"}, {value: 245, name:"photovideoshoot"}, {value: 246, name:"professionalhiring"}, {value: 13801, name:"privateparty"}, {value: 236, name:"religious"}, {value: 237, name:"restaurant"}, {value: 13802, name:"wedding"}];
	$scope.artists = [];
	$scope.alerts = [];
	$scope.submit = {includePrice: false};
	$scope.location = "";
	$scope.budget = 0;
	$scope.activeDealId = 0;

	$scope.eventName = "";

	$scope.subcategoriesMap = {1: ["Any Subcategory","Anchor","Emcee","Voice over Artist", "Radio Jockey"], 2:["Any Subcategory", "Film Stars", "Sports Celebrities","TV Personalities","Pageant Winner"], 3: ["Any Subcategory", "Stand Up","Impersonators","Mimicry","Reality Show Comedians"], 4: ["Any Subcategory","Belly Dancers","Exotic Dancers","Bhangra","Bollywood","Choreographers","Indian Classical","Kids Troupe","Folk","Religious","Reality Show Dancers","Western"], 5: ["Any Subcategory", "Techno","EDM","Trance","Bollywood","Rock","Dubstep","Deep House","Minimal", "VDJ","Electro","Progressive","Psychedelic","Trap","Bass"], 6:["Any Subcategory","Guitarist","Percussionist","Flutist","Pianist","Saxophonist","Keyboardist","Violinist","Indian Classical Instruments","One-man band"],7: ["Any Subcategory", "Sufi","Bollywood","Rock","Fusion","Pop","Jazz","Metal","Orchestra","Blues","Folk","Indie","Tribute","Alternative","Punk","Funk","Progressive","Psychedelic","Electronica","Rock n Roll","Reggae","Rap","Hip Hop"], 8: ["Any Subcategory", "Stage Magicians","Illusionist","Close up Magicians","Hypnotist","Mind Reader"], 9: ["Any Subcategory", "Fashion","Bridals & Parties","Film & Television","Wardrobe Stylist","Fashion Choreographer"], 10:["Any Subcategory","Runway Models","Catalogue Models","Commercial Models","Glamour Models","Art Models","Promotional Models","Foreign Models","International Models"], 11: ["Any Subcategory","Wedding","Baby","Candid","Concept","Corporate Films","Documentary Films","Events","Fashion","Short Films","Portfolio","Weddings","Portrait","Product"],12:["Any Subcategory", "Bollywood","Classical","English Retro","Ghazal","Hindi Retro","Indian Folk","Karaoke","Qawwali","Religious","Acoustic Singer","Rapper"],13: ["Any Subcategory", "Motivational","Vocational","Spiritual","Training"],14: ["Any Subcategory", "Acrobat Artists","Balloon Artists","Bartenders","Caricaturists","Painters","Fire Artists","Jugglers","Mehendi Artists","Puppeteers","Stilt Walkers","Stunt Artists","Shadow Artists","Sand Artists","Whistler","Beatboxer"]};
	$scope.subcategories = ["Any Subcategory"];

	$scope.genders = ["Any Gender", "Male", "Female", "Others"];
	$scope.subscriptions = ["Any Subscription", "StarClinch Black", "StarClinch Gold", "StarClinch Plus"];
	$scope.languages = ["Any Language", "English","Hindi","Punjabi","Gujarati","Bengali","Malayalam","Marathi","Tamil","Telugu","Kannada","Assamese","Rajasthani"];
	$scope.pitchList = [];
	$scope.cities=['Achalpur', 'Agartala', 'Agra', 'Ahmadnagar', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Alappuzha', 'Aligarh', 'Alipurduar', 'Allahabad', 'Alwar', 'Ambala', 'Ambur', 'Amravati', 'Amritsar', 'Anand', 'Anantapur', 'Anjaw', 'Asansol', 'Aurangabad', 'Azamgarh', 'Baharampur', 'Baleshwar', 'Balurghat', 'Bangalore', 'Bangaon', 'Bardhaman', 'Bareilly', 'Barnala', 'Batala', 'Bathinda', 'Beawar', 'Begusarai', 'Belgaum', 'Bellary', 'Bhagalpur', 'Bhiwani', 'Bhopal', 'Bhubaneswar', 'Bijnor', 'Bikaner', 'Bilaspur', 'Bokaro Steel City', 'Bulandshahr', 'Chamba', 'Chandausi', 'Chandigarh', 'Chandrapur', 'Chennai', 'Chhapra', 'Chittoor', 'Churu', 'Coimbatore', 'Cuttack', 'Daman', 'Darbhanga', 'Darjeeling', 'Dehradun', 'Deoghar', 'Dhanbad', 'Dharamshala', 'Dhule', 'Dibrugarh', 'Dimapur', 'Dohad', 'Durg-Bhilainagar', 'Durgapur', 'Etawah', 'Firozpur', 'Gandhidham', 'Ganganagar', 'Gangtok', 'Ghazipur', 'Giridih', 'Godhra', 'Gondiya', 'Gorakhpur', 'Gulbarga', 'Guna', 'Guwahati', 'Gwalior', 'Hajipur', 'Haldwani-Kathgodam', 'Haridwar', 'Hisar', 'Hoshiarpur', 'Hubli-Dharwad', 'Hyderabad', 'Ichalkaranji', 'Imphal', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jalpaiguri', 'Jamalpur', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhunjhunu', 'Jodhpur', 'Jorhat', 'Kaithal', 'Kanhangad', 'Kannur', 'Kanpur', 'Kapurthala', 'Karbi Anglong', 'Karnal', 'Kasaragod', 'Kasauli', 'Katihar', 'Khanna', 'Kharagpur', 'Koch Bihar', 'Kochi', 'Kolhapur', 'Kolkata', 'Kollam', 'Kota', 'Kothamangalam', 'Kottayam', 'Kozhikode', 'Kumbakonam', 'Latur', 'Lucknow', 'Ludhiana', 'Madurai', 'Malappuram', 'Manali', 'Mangalore', 'Margao', 'Mathura', 'Maunath Bhanjan', 'Meerut', 'Moga', 'Moradabad', 'Mormugao', 'Muktsar', 'Mumbai', 'Muzaffarpur', 'Mysore', 'NCR / Delhi', 'Nagaon', 'Nagar Haveli', 'Nagercoil', 'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai Panvel Raigad', 'New Delhi', 'Neyveli', 'Palakkad', 'Palwal', 'Panaji', 'Panchkula', 'Panipat', 'Panvel', 'Papum Pare', 'Pathankot', 'Patiala', 'Patna', 'Phagwara', 'Porbandar', 'Port Blair', 'Prakasam', 'Puducherry', 'Pune', 'Puri Town', 'Purnea', 'Purulia', 'Raigarh', 'Raipur', 'Rajapalayam', 'Rajkot', 'Ranchi', 'Raurkela', 'Rewari', 'Rishikesh', 'Rohtak', 'Roorkee', 'Rudrapur', 'S.A.S. Nagar', 'Sagar', 'Saharanpur', 'Sangali', 'Shillong', 'Shimla', 'Silchar', 'Siliguri', 'Siwan', 'Solan', 'Sonipat', 'Srinagar', 'Sultanpur', 'Surat', 'Tawang', 'Tezpur', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tiruppur', 'Tura', 'Udaipur', 'Udhagamandalam', 'Udupi', 'Ujjain', 'Vadodara', 'Vapi', 'Varanasi', 'Vellore', 'Vidisha', 'Visakhapatnam', 'Warangal', 'Yamunanagar']
	$scope.states = ['Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadar and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

	$scope.manifestVersion = 0;

	$scope.getManifestVersionScope = function(){
		Utils.getManifestVersion(manifestVersion => {
			$scope.manifestVersion = manifestVersion;
		});
	}
	
	$scope.categoryChange = function(){
		$scope.search.subcategory = "Any Subcategory";
		if($scope.subcategoriesMap[$scope.search.category]){
			$scope.subcategories = $scope.subcategoriesMap[$scope.search.category]
		}else{
		 	$scope.subcategories = ["Any Subcategory"]
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
		$scope.sorting.order = [key, (key === "updated" ? "price" : "updated")];
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
		$scope.search.categoryName = ($scope.categories.find(c => c.value == $scope.search.category) || {}).name
		
		$scope.pagination.loading = true;
		$scope.alerts = $scope.alerts.filter(a => a.type !== "ARTISTS");
		$scope.artists = [];
		$scope.pagination.currentPage = 1;
		$scope.pagination.totalItems = 0;
		$scope.loadMoreArtists = undefined;
		$scope.artistsToShow = [];
		let fields = ["id", "professionalname", "city", "email", "phone", "category", "subcategory", "url", "thumbnail", "updated", "pitchcount", "gigcount", "subscription", "maxprice", "profilewp"];
		if($scope.eventName){
			fields.push(`${$scope.eventName}_p`);
		}
		let options = {
						view: "TestView",
		    			fields,
		    			sort: $scope.sorting.order.map(k => ({field: (k === "price" && $scope.eventName ? `${$scope.eventName}_p` : (k === "price" ? "maxprice" : k)), direction: $scope.sorting[k]}))
		    		}

		let categoryObj = $scope.categories.find(c => c.value != 0 && c.value == $scope.search.category);
		let conditions = [];
		let filterByFormula = "";

		if($scope.eventName){
			filterByFormula+="&pa_events="+$scope.search.event
		}

		if($scope.search.name){
			filterByFormula+="&search="+$scope.search.name.trim()
		}

		if(categoryObj){
			conditions.push(`FIND("${categoryObj.name.toLowerCase()}", LOWER(category))`);
		}
		if($scope.search.city && $scope.search.city.trim()){
			filterByFormula+="&pa_city="+city_id_reverse[$scope.search.city]
		}

		if($scope.search.state && $scope.search.state.trim()){
			filterByFormula+="&pa_state="+state_id[$scope.search.state]
		}

		if($scope.search.price === 0 || ($scope.search.price && !isNaN($scope.search.price))){
			filterByFormula+="&filter[meta_key]=maxprice&filter[meta_compare]=<&filter[meta_value]="+$scope.search.price
		}

		if($scope.search.gender && $scope.search.gender !== "Any Gender"){
			filterByFormula+="&pa_gender="+gender_id[$scope.search.gender]
		}

		if($scope.search.subcategory && $scope.search.subcategory !== "Any Subcategory"){
			conditions.push(`FIND("${$scope.search.subcategory.toLowerCase()}", LOWER(subcategory))`)
		}

		if($scope.search.subscription && $scope.search.subscription !== "Any Subscription"){
			filterByFormula+="&pa_member="+subscription_id[$scope.search.subscription]
		}

		if($scope.search.language && $scope.search.language !== "Any Language"){
			filterByFormula+="&pa_languages="+language_id[$scope.search.language]
		}
		// "Authorization": `Basic ${window.btoa('ck_f894e409f58f0f1bb0a869009a4ff3b2ad35f79c:cs_812fe84d8d3c94a20242727fd276f2233cffc677')}`,
		$http({
			method: "GET",
			url: "https://starclinch.com/wp-json/wp/v2/product?per_page=100&product_cat="+category_id[($scope.search.subcategory=="Any Subcategory"?categoryObj.name:$scope.search.subcategory).toLowerCase()]+filterByFormula,
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			$timeout(() => {
				$scope.artists.push(...response.data.map(v => {				
					if(v.pitchcount=='')
						v.pitchcount=0
					let artist = {...v.fields, professionalname: v.title.rendered, url: v.link, city: city_id[v.pa_city[0]], profilewp: v.post_image, id: v.id, pitchcount:v.pitchcount, gigcount:v.gigcount, minprice:v.minprice, maxprice:v.maxprice};
					console.log(state)
					if(state && state.artists){
						artist.checked = (state.artists.find(a => a.id === artist.id) || {}).checked;
					}
					artist.checked = ($scope.pitchList.find(a => a.id === artist.id) || {}).checked;
					return artist;
				}));
				console.log($scope.artists)
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
				})
		}).catch(e => {
			console.log("Unable to posts checked artists", e);
		});
		/*$scope.airtable("Artists")
		.select(options)
		.eachPage(function(records, fetchNextPage) {
			$timeout(() => {
				// $scope.loadMoreArtists = fetchNextPage;
				// $scope.artists.push(...records.map(v => {
				// 	console.log(v)
				// 	let artist = {...v.fields, rowId: v.fields.id, id: v.id};
				// 	if(state && state.artists){
				// 		artist.checked = (state.artists.find(a => a.id === artist.id) || {}).checked;
				// 	}
				// 	artist.checked = ($scope.pitchList.find(a => a.id === artist.id) || {}).checked;
				// 	return artist;
				// }));
				// console.log(records)

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
					$scope.alerts.push({danger: true, msg: "Unable to load artists. Make sure the AirTable token is valid."});
				}
				$scope.pagination.loading = false;
			});
		});*/
	}

	$scope.setEventName = () => {
		$scope.eventName = ($scope.event.find(e => e.value == $scope.search.event) || {}).name;
		if($scope.eventName){
			$scope.eventName = $scope.eventName.toLowerCase().replace(/[^a-z]/g, "");
		}
	}


	$scope.loadDeal = dealId => {
		let loadDeal = () => {
			if($scope.dealId){
				$scope.clearPitchList();
				$scope.pagination.loading = true;
				$scope.alerts = $scope.alerts.filter(a => a.type !== "DEAL");
				$http.get(`https://api.pipedrive.com/v1/deals/${$scope.dealId}?api_token=${$scope.PIPEDRIVE_TOKEN}`).then(r => r.data).then(r => r.data).then(data => {
					$scope.search.category = parseInt(data["61a501536a4065f5a970be5c6de536cf7ad14078"]);
					$scope.categoryChange();
					$scope.search.event = parseInt(data["755ded0be98b3ee5157cf117566f0443bd93cc63"]);

					$scope.originalDealEvent = $scope.search.event;

					$scope.setEventName();

					$scope.search.price = data.value;
					$scope.search.budget = parseInt(data.value);
					// $scope.search.city = data["361085abd375a7eb3964f068295f12fe17d9f280_admin_area_level_2"];
					$scope.search.state = data["361085abd375a7eb3964f068295f12fe17d9f280_admin_area_level_1"];
					$scope.location = data["361085abd375a7eb3964f068295f12fe17d9f280"];
					console.log("location = " + $scope.location);
					$scope.search.name = data["ef1b3ca0c720a4c39ddf75adbc38ab4f8248597b"];
					$scope.search.gathering = data["1f9805fdb8715d773f1fc9457545b49c5b05d058"];
					$scope.search.date = data["19c2c12d8fea52c4709cd4ce256b7852bc2b0259"];
					$scope.search.lookingfor = data["ef1b3ca0c720a4c39ddf75adbc38ab4f8248597b"];
					$scope.search.clientname = data["person_name"];
					$scope.search.clientemail = data["person_id"]["email"][0]["value"];
					$scope.search.dealowner = data["owner_name"];
					$scope.search.json = data;
					$scope.activeDealId = $scope.dealId;
					$scope.loadArtists();
					$scope.pagination.loading = false;
					$scope.search.dealTitle = data.title;
					console.log("@loadDeal", $scope.search);
					
				}).catch(e => {
					console.log(e)
					$scope.pagination.loading = false;
					$scope.alerts.push({danger: true, msg: `Unable to get deal "${$scope.dealId}" details. Make sure the PipeDrive token is valid.`});
				});
			}else{
				$scope.loadArtists();
			}
		}
		
		if(dealId){
			$scope.dealId = dealId;
			$scope.search = {...DEFAULE_SEARCH_PARAMS};
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
										$scope.setEventName();
									}
									if(state.sorting){
										$scope.sorting = {...$scope.sorting, ...state.sorting};
									}
									$scope.dealId = dealId;
									$scope.submit.includePrice = state.includePrice;
									$scope.location = state.location;
									$scope.activeDealId = state.activeDealId;
									$scope.pitchList = state.pitchList || [];
								}
								//if($scope.activeDealId == dealId){
									//$scope.loadArtists(state);
								//}
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
		let artist = $scope.pitchList.filter(a => a.checked).map(a => a.id)
		let pitchcounts = $scope.pitchList.filter(a => a.checked).map(a => parseInt(a.pitchcount)+1)
		let categoryName = ($scope.categories.find(c => c.value == $scope.search.category) || {}).name
		// let artistQuery = `OR(${artists.map(id => ("RECORD_ID()='" + id + "'")).join()})`;
		let artistshtmlstring = $scope.pitchList.filter(a => a.checked).reduce((a, c) => {
									a += `<div id="${c.id}" style="margin-bottom: 15px !important;"> 
												    	<div style="padding: 5px; margin: 0px !important; display: inline;"> 
												    		<a href="${c.url}"><img src="${c.profilewp}" style="width:65px; height:65px; border-radius: 50%;"></a>
												    	</div>
											    		<div style="width: 60%; display: inline-block;"> 
											    			<a style="color:#525252; text-decoration: none; " href="${c.url}"><h4 style="margin: 0 auto">${c.professionalname}</h4></a>
											    			<div><div>${c.city}</div></div>
											    		</div>
											    </div>`;
									return a;
								}, "");
		let eventName = ($scope.event.find(e => e.value == $scope.originalDealEvent) || {}).name;
		if(eventName){
			eventName = eventName.toLowerCase().replace(/[^a-z]/g, "");
		}
		let artisturl = $scope.pitchList.filter(a => a.checked).map(a => a.url).join().replace(/https:\/\/starclinch.com\//g, '');
		let artistprofessional = $scope.pitchList.filter(a => a.checked).map(a => a.professionalname).join()
		let json = {
			fields:{
				dealid: parseInt($scope.activeDealId),
				includeprice: ($scope.submit.includePrice ? 1 : 0),
				artists: artist.join(),
				artisturls: artisturl,
				artistnames: artistprofessional,
				categoryname: categoryName,
				eventname: eventName,
				city: $scope.search.city,
				state: $scope.search.state,
				location: $scope.location,
				budget: $scope.search.budget,
				gathering: $scope.search.gathering,
				date: $scope.search.date,
				lookingfor: $scope.search.lookingfor,
				clientname: $scope.search.clientname,
				clientemail: $scope.search.clientemail,
				dealowner: $scope.search.dealowner,
				// artistquery: artistQuery,
				pitchcount: pitchcounts.join(),
				artistshtml: artistshtmlstring,
				json: JSON.stringify($scope.search.json)
			}
		}

		$scope.pagination.loading = true;
		console.log(json)
		// artist.forEach(function (e, ind) {
		// 	$http({
		// 		method: "POST",
		// 		url: "https://starclinch.com/wp-json/acf/v3/posts/"+e+"?fields[pitchcount]="+pitchcount[ind],
		// 		headers: {	
		// 			'Authorization':'Basic aGFyc2hpdHN0YXI6bmVvbjA0JEhBUzE=',
		// 			'content-type': 'application/json'
		// 		}
		// 	})
		// })
		$http({
			method: "POST",
			url: "https://api.airtable.com/v0/appAOUimmyFijLDUZ/ArtistPitch",
			headers: {
				"Authorization": `Bearer ${$scope.AIRTABLE_TOKEN}`
			},
			data: json
		}).then(response => {
			console.info("Artists were posted", response);
			$scope.alerts.push({success: true, msg: "Artists were pitched"});
			$scope.clearPitchList();
			$scope.closePitchList && $scope.closePitchList();
			$scope.pagination.loading = false;
		}).catch(e => {
			console.warn("Unable to posts checked artists", e);
			$scope.alerts.push({danger: true, msg: "Unable to pitch selected artists"});
			$scope.pagination.loading = false;
		});
	}

	$scope.saveState = () => {
		let state = {artists: $scope.artists.map(a => ({id: a.id, checked: a.checked})), currentPage: $scope.pagination.currentPage, search: $scope.search, sorting: $scope.sorting, includePrice: $scope.submit.includePrice, location: $scope.location, activeDealId: $scope.activeDealId, pitchList: $scope.pitchList};
		Utils.setState(state);
	}

	$scope.openPitchList = () => {
		console.log("@openPitchList");
		let instance = $uibModal.open({
	      templateUrl: "pitchList.html",
	      backdrop: "static",
	      controller: () => {},
	      size: "md",
	      scope: $scope
		});
		$scope.closePitchList = () => {
			instance.close();
		}
	}

	$scope.test = (artist, $event) => {
		$($event.target).addClass('ng-hide')
		console.log($event.target)
		// $event.target.ngHide=true
		$http({
			method: "GET",
			url: "http://artist.starclinch.com/api/getcontact/"+artist.id,
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			artist.email=response.data.email
			artist.phone=response.data.phone
		}).catch(e => {
			artist.email=artist.phone='Not available'
		});
	}

	$scope.artistStateChange = (artist) => {
		if(artist.checked){
			$scope.pitchList.push(artist);
		}else{
			($scope.artists.find(a => a.id === artist.id) || {}).checked = false;
			$scope.pitchList = $scope.pitchList.filter(a => a.id !== artist.id)
		}
		$scope.saveState();
	}

	$scope.clearPitchList = () => {
		$scope.pitchList.forEach(a => {
			($scope.artists.find(ar => ar.id === a.id) || {}).checked = false;
		});
		$scope.pitchList = [];
		$scope.saveState();
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
