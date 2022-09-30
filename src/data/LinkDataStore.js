/*
 * This represents the reactive data to be edited.
 *
 * It contains no interaction logic (YAY!), just information about the links.
 *
 * It is initialized with example data to start but links could be set to empty and still work.
 *
 * @author Robert C. Duvall
 * @author Dennis Quan
 */

// package that bundles up query parameters given as an Object into URL syntax
import querystring from 'querystring';


// which URL to use to get the data from (remote or local)
//const DATA_URL = 'https://cryptic-savannah-11810.herokuapp.com/';
const DATA_URL = '';


// simple utility function to encode the given object as query parameters and return the resulting JSON
// NOTE, queryParameters contains values meant to be passed along with the URL (i.e., after the ?)
// NOTE, protocolOptions contains values meant to be passed along with the request (i.e., GET/POST, headers, etc.)
async function getJSON(url, apiAction, queryParameters, protocolOptions) {
    const parameters = queryParameters ? `?${querystring.stringify(queryParameters)}` : '';
    const urlWithParameters = `${url}${apiAction}${parameters}`;
    console.log(urlWithParameters);
    const response = await fetch(urlWithParameters, protocolOptions);
    return response.json();
}

async function getCoordinates() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

export const linkDataStore = {
    data: () => [],
    //dataRef: DB.ref('data'),
    useRemoteServer: true,
    async initData () {
        //this.data = await getJSON(DATA_URL, 'api/getLinks?lat='+lat+'&long='+long);
        this.data = await getJSON(DATA_URL, 'api/getLinks');
        console.log(`Getting initial version of data`);
    },
    async getnewlat(name){
        const position = await getCoordinates(); 
        let lat = position.coords.latitude
        if(name!=undefined){
            await fetch('https://safe-river-16409.herokuapp.com/api/sendlat?lat='+lat+'&name='+name)
        }
        return lat
    },
    async getnewlng(name){
        const position = await getCoordinates(); 
        let lng = position.coords.longitude;
        if(name!=undefined){
            await fetch('https://safe-river-16409.herokuapp.com/api/sendlong?long='+lng+'&name='+name)
        }
        return lng
    },
    // change title of group at the given index
    // NOTE, if index can change, then should use a unique ID instead
    async setTitle (index, newTitle) {
        console.log(`Setting title from ${this.data[index].title} to ${newTitle}`);
        // coming soon ...
    },
    // add new link to group at the given index
    // NOTE, if index can change, then should use a unique ID instead
    async addLink (index, newLink) {
        console.log(`Adding new link ${newLink.name} to group ${this.data[index].title}`);
        // coming soon ...
    }
};
