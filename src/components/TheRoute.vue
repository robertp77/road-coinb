<template>
    <div id="mapContainer"></div>
</template>
<script>
import * as L from 'leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
export default {
    name: 'TheRoute',
    props: {
        // group to be displayed
        firstLat: {
            type: String,
            required: true,
        },
        firstLong: {
            type: String,
            required: true,
        },
        nextLat: {
            type: String,
            required: true,
        },
        nextLong: {
            type: String,
            required: true,
        }
        /*
        theLong: {
            type: String,
            required: true,
        }
        */
    },
    data () {
        return {
            // backing data for edits using v-model, no copy needed since Strings are immutable
            title: 'test'
            // may also need a copy group information if there is any chance it might be changed interactively
        };
    },
    methods: {
        // emit event that signals a new link is ready to be added
        // NOTE, error checking is done in the child component
        setupmap(){
            /*
            var thelat=0
            var thelong=0
            function success(position) {
                console.log(7)
                thelat=position.coords.latitude;
                thelong=position.coords.longitude;
            }
            
            function error() {
                console.log('Unable to retrieve your location');
            }
            /*
            if(!navigator.geolocation) {
                console.log('Geolocation is not supported by your browser');
            } else {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            function work() {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            work()
            */
            const mymap = L.map('mapContainer')
            var polygon = L.polygon([
            [this.fistLat, this.firstLong],
            [this.nextLat, this.nextLong]
            ]).addTo(mymap);
            polygon.bindPopup('<h4>test</h4>').openPopup();
            let circle = L.circle([this.fistLat, this.firstLong], {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 25,
            }).addTo(mymap);
            circle.bindPopup('<h4>test</h4>').openPopup();
            let circle2 = L.circle([this.nextLat, this.nextLong], {
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.5,
                radius: 25,
            }).addTo(mymap);
            circle2.bindPopup('<h4>test</h4>').openPopup();
        },
        addLink (newLink) {
            console.log(`EVENT: add new item ${newLink.name} to ${this.linkGroup.title}`);
            this.$emit('new-link', this.groupId, newLink);
            // may also do additional work related to logging, interactivity, or other tracking changes
        }
    },

    mounted () {
        this.setupmap();
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