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

	static setValue(key, value){
		if(window.chrome && window.chrome.storage && window.chrome.storage.sync && window.chrome.storage.sync.set){
			window.chrome.storage.sync.set({[key]: value});
		}else if(window.localStorage){
			window.localStorage[key] = value;
		}
	}

	static getValue(key, callback){
		if(window.chrome && window.chrome.storage && window.chrome.storage.sync && window.chrome.storage.sync.get){
			window.chrome.storage.sync.get(key, values => {
				callback(values && values[key]);
			});
		}else if(window.localStorage){
			callback(window.localStorage[key]);
		}else{
			callback();
		}
	}
}