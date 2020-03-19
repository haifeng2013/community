
import sendReq from './XHR'
import {geoservice, revgeoservice} from './configs.json'
import {APIKey} from './credentials.json'

export function getMyLocation() {
    return new Promise((resolve, reject)=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve);
        } else {
            reject();
        }
    })
}

export async function geocode(searchtext) {
    const url = geoservice + '/geocode.json?apiKey=' + APIKey + '&searchtext=' + searchtext;
    const res = await sendReq('GET', url, {}, {});
    
    return res;
}
  
export async function revgeocode(coord) {
    const coordstr = coord.latitude + ',' + coord.longitude + ',0';
    const url = revgeoservice + '/reversegeocode.json?apiKey=' + APIKey + '&mode=retrieveAddresses&prox=' + coordstr;
    const res = await sendReq('GET', url, {}, {});
    return res;
}