<template>
    <div id="app">
        <a :href="apiUrlBase + 'api/auth/login'">Login</a><br>
        <a :href="apiUrlBase + 'api/auth/logout'">Logout</a><br>
        <the-map/>
    </div>
</template>

<script>
// import UrlList from './components/UrlList.vue'
import { linkDataStore } from './data/LinkDataStore.js'
import TheMap from './components/TheMap.vue'
//import TheRoute from './components/TheRoute.vue'
//import * as L from 'leaflet';
//import '../node_modules/leaflet/dist/leaflet.css';
export default {
    name: 'App',
    components: {
        TheMap
    },
    data () {
        return {
            // allow Vue access to primary data structure so it is reactive
            allLinks: linkDataStore,
            apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
            latit:'',
            longit:''
        };
    },
    // simple wrappers that call data store methods, but could coordinate methods or handle interactivity
    methods: {
        setTitle (index, newTitle) {
            console.log(`CAUGHT: new title ${newTitle} to replace ${this.allLinks.data[index].title}`);
            this.allLinks.setTitle(index, newTitle);
        },
        addLink (index, newLink) {
            console.log(`CAUGHT: add new item ${newLink.name} to ${this.allLinks.data[index].title}`);
            this.allLinks.addLink(index, newLink);
        }

    },
    mounted () {
        console.log(9)
        console.log(this.apiUrlBase+'api/auth/login')
        //await this.allLinks.initData();
        //console.log(this.allLinks.data)
        //console.log(this.allLinks.data)
        /*
        var thelat=0
        var thelong=0
        console.log(999)
        function success(position) {
            thelat=position.coords.latitude;
            thelong=position.coords.longitude;
        }
        
        function error() {
            console.log('Unable to retrieve your location');
        }
        
        if(!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        const mymap = L.map('mapid').setView([thelat, thelong], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mymap);

        for(let i=1;i<this.allLinks.data.length;i++){
            var polygon = L.polygon([
            [this.allLinks.data[i].requestedpickuplat, this.allLinks.data.users[i].requestedpickuplong],
            [this.allLinks.data[i].requesteddropofflat, this.allLinks.data.users[i].requesteddropofflong]
            ]).addTo(mymap);
            polygon.bindPopup('<h4>'+this.allLinks.data[i].name+'</h4>').openPopup();
            let circle = L.circle([this.allLinks.data[i].requestedpickuplat, this.allLinks.data[i].requestedpickuplong], {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 25,
            }).addTo(mymap);
            circle.bindPopup('<h4>'+this.allLinks.data[i].name+'</h4>').openPopup();
            let circle2 = L.circle([this.allLinks.data[i].requesteddropofflat, this.allLinks.data[i].requesteddropofflong], {
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.5,
                radius: 25,
            }).addTo(mymap);
            circle2.bindPopup('<h4>'+this.allLinks.data[i].name+'</h4>').openPopup();
        }
        */
    }
}       
</script>