class Utils{
	static get PIPEDRIVE_TOKEN_KEY(){
		return "PIPEDRIVE_TOKEN";
	}

	static get AIRTABLE_TOKEN_KEY(){
		return "AIRTABLE_TOKEN";
	}

	static get PIPEDRIVE_TEMP_TOKEN_KEY(){
		return "PIPEDRIVE_TEMP_TOKEN";
	}

	static get AIRTABLE_TEMP_TOKEN_KEY(){
		return "AIRTABLE_TEMP_TOKEN";
	}

	static get STATE_KEY(){
		return "STATE";
	}

	static getPipedriveToken(callback){
		Utils.getValue(Utils.PIPEDRIVE_TOKEN_KEY, callback);
	}

	static getAirtableToken(callback){
		Utils.getValue(Utils.AIRTABLE_TOKEN_KEY, callback);
	}

	static getTempPipedriveToken(callback){
		Utils.getValue(Utils.PIPEDRIVE_TEMP_TOKEN_KEY, callback);
	}

	static getTempAirtableToken(callback){
		Utils.getValue(Utils.AIRTABLE_TEMP_TOKEN_KEY, callback);
	}

	static getState(callback){
		Utils.getValue(Utils.STATE_KEY, callback);
	}

	static setPipedriveToken(token){
		Utils.setValue(Utils.PIPEDRIVE_TOKEN_KEY, token);
	}

	static setAirtableToken(token){
		Utils.setValue(Utils.AIRTABLE_TOKEN_KEY, token);
	}

	static setTempPipedriveToken(token){
		Utils.setValue(Utils.PIPEDRIVE_TEMP_TOKEN_KEY, token);
	}

	static setTempAirtableToken(token){
		Utils.setValue(Utils.AIRTABLE_TEMP_TOKEN_KEY, token);
	}

	static setState(state){
		Utils.setValue(Utils.STATE_KEY, state);
	}

	static setValue(key, value){
		if(window.chrome && window.chrome.storage && window.chrome.storage.local && window.chrome.storage.local.set){
			window.chrome.storage.local.set({[key]: value});
		}else if(window.localStorage){
			window.localStorage[key] = typeof(value) === "object" ? JSON.stringify(value) : value;
		}
	}

	static getValue(key, callback){
		if(window.chrome && window.chrome.storage && window.chrome.storage.local && window.chrome.storage.local.get){
			window.chrome.storage.local.get(key, values => {
				callback(values && values[key]);
			});
		}else if(window.localStorage){
			if(key === Utils.STATE_KEY){
				callback(JSON.parse(window.localStorage[key]));
			}else{
				callback(window.localStorage[key]);
			}
		}else{
			callback();
		}
	}

	static getDealId(callback){
		if(window.chrome && window.chrome.tabs){
			chrome.tabs.query({'active': true}, tabs => {
				if(tabs && tabs.length && tabs[0].url && /starclinch\.pipedrive\.com\/deal\/\d+/.test(tabs[0].url)){
					callback(tabs[0].url.match(/deal\/(\d+)/)[1]);
				}else{
					callback();
				}
			});
		}else{
			callback();
		}
	}

	static getManifestVersion(callback) {
		var manifestVersion = chrome.runtime.getManifest().version;
		console.log(manifestVersion);
		callback(manifestVersion);
	}
}