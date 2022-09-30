/*
 * This represents displaying a group of links.
 *
 * This is an example of a convenience component that serves to organize the data hierarchy.
 * It re-emits the custom events of its child components, adding its own information to them
 * to provide for future data accessor methods.
 *
 * @author Dennis Quan
 * @author Robert Duvall
 */

// display group as a column or cards that is organized by BootstrapVue
<template>
    <div id="mapwrap">
        <header>
            <h1>{{score}} miles available for ride requests. Complete ride requests on the map to earn more miles! {{isloading}}</h1>
        </header>
        <div id="mapContainer"></div>
        <b-button id="request" @click="setpickup">{{reqstatus}}</b-button>
    </div>
</template>

<script>
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import '../../node_modules/leaflet/dist/leaflet.css';
import '../../node_modules/leaflet-geosearch/dist/geosearch.css';
import { linkDataStore } from '../data/LinkDataStore.js'
import image from './Images/pin.png' 
//import { getJSON } from './apiHelper';
export default {
    name: 'TheMap',
    data () {
        return {
            // backing data for edits using v-model, no copy needed since Strings are immutable
            allLinks: linkDataStore,
            map: 'test',
            pickuploc:'init',
            reqstatus: 'request ride',
            provider: 'test',
            searchControl: 'test',
            reqpickuploc:'test',
            reqdropoffloc:'test',
            thert:'test',
            pickuplat:0,
            pickuplong:0,
            lat:0,
            long:0,
            userid:"",
            ispick:"",
            thepopup:"",
            thegiveridepopups:[],
            cost:"",
            riderid:"",
            enroute:false,
            thebtns:[],
            inds:[],
            yesbtns:[],
            nobtns:[],
            containers:[],
            giving:false,
            okbtns:[],
            loggedin:false,
            loggedin2:false,
            requested:false,
            theuserid:{},
            otherreqstatus:false,
            score:15,
            isloading:'(loading map)'
            // may also need a copy group information if there is any chance it might be changed interactively
        };
    },
    methods: {
        // emit event that signals a new link is ready to be added
        // NOTE, error checking is done in the child component
        async getrides(){
            const response = await fetch('https://safe-river-16409.herokuapp.com/api/getLinks')//?lat='+this.lat+'&long='+this.long);
            return response.json();
        },
        async getriderlat(id){
            const response = await fetch('https://safe-river-16409.herokuapp.com/api/getriderlat?id='+id);
            return response.json();
        },
        async getriderlong(id){
            const response = await fetch('https://safe-river-16409.herokuapp.com/api/getriderlong?id='+id);
            return response.json();
        },
        work(value){
            console.log(value.location)
            this.pickuploc.setLatLng([value.location.y,value.location.x])
        },
        updatePoly(oldLatLng){
            this.thert.remove()
            this.thert=L.polygon([
                [this.pickuplat, this.pickuplong],
                [oldLatLng.latlng.lat, oldLatLng.latlng.lng]
            ]).addTo(this.map);
        },
        conpick(){
            this.pickuploc.on('move',this.confirm2)
            this.pickuplat=this.pickuploc.getLatLng().lat
            this.pickuplong=this.pickuploc.getLatLng().lng
            this.thert=L.polygon([
                [this.pickuplat, this.pickuplong],
                [this.pickuplat, this.pickuplong+0.003]
            ]).addTo(this.map);
            this.reqpickuploc=L.circle([this.pickuplat, this.pickuplong], {
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5,
                radius: 25,
            }).addTo(this.map);
            //console.log(this.pickuploc.getLatLng().lat)
            this.pickuploc.setLatLng([this.pickuplat,this.pickuplong+0.003])
            this.pickuploc.on('move',this.updatePoly)
            this.thepopup.setLatLng([this.pickuplat+(0.003/(this.map.getZoom()**9))*(13**9),this.pickuplong+0.003])
            var container = L.DomUtil.create('div')
            var btn = L.DomUtil.create('button', '', container);
            var btn2 = L.DomUtil.create('button', '', container);
            btn.setAttribute('type', 'button');
            btn2.setAttribute('type', 'button');
            btn.innerHTML = 'confirm dropoff';
            btn2.innerHTML = 'cancel';
            L.DomEvent.on(btn, 'click', async () => {
                await this.condrop()
            });
            L.DomEvent.on(btn2, 'click', () => {
                this.reqpickuploc.remove()
                this.thert.remove()
                this.pickuploc.remove()
                this.otherreqstatus=false
                this.thepopup.remove()
            });
            var newDiv = document.createElement("div");
            newDiv.appendChild(btn);
            newDiv.appendChild(btn2);
            this.thepopup.setContent(newDiv)
            this.thepopup.openOn(this.map)
        },
        async condrop(){
            if(this.theuserid==undefined&&this.loggedin2==false){
                window.location.assign("https://safe-river-16409.herokuapp.com/api/auth/login")
                this.loggedin2=true
                const theuserid = await this.use();
                this.theuserid=theuserid.id
                await this.condrop()
            }
            else if(this.theuserid==undefined&&this.loggedin2==true){
                const theuserid = await this.use();
                this.theuserid=theuserid.id
                console.log(this.theuserid)
                await this.condrop()
            }
            else{
                this.givingans=await this.getgive()
                if(this.givingans.requested==undefined){
                    this.requested=false
                }
                else if(this.givingans.requested=='False'){
                    this.requested=false
                }
                else{
                    this.requested=true
                }
                if(this.requested==false){
                    await fetch('https://safe-river-16409.herokuapp.com/api/changerequested',{ credentials: 'include'})
                    this.reqdropoffloc=L.circle([this.pickuploc.getLatLng().lat, this.pickuploc.getLatLng().lng], {
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 0.5,
                        radius: 25,
                    }).addTo(this.map);
                    this.thepopup.remove()
                    this.pickuploc.remove()
                    this.reqstatus='cancel request (5 mile penalty)'
                    this.requested=true
                    this.otherreqstatus=false
                    this.oldscore=await this.getscore()
                    await fetch('https://safe-river-16409.herokuapp.com/api/sendride?requestedpickuplat='+this.pickuplat+'&requestedpickuplong='+this.pickuplong+'&requesteddropofflat='+this.pickuploc.getLatLng().lat+'&requesteddropofflong='+this.pickuploc.getLatLng().lng,{ credentials: 'include'})
                    await this.checkriderdest(this.oldscore)
                }
                else{
                    alert('You have already requested a ride')
                }
            }
        },
        async waitfordriver(oldscore){
            this.score=await this.getscore()
            if(this.score==oldscore){
                await this.waitfordriver(oldscore)
            }
            else{
                console.log('success')
            }
        },
        async getscore(){
            const response=await fetch('https://safe-river-16409.herokuapp.com/api/grabscore',{ credentials: 'include'})
            return response.json()
        },
        async checkriderdest(oldscore){
            this.lat=await this.allLinks.getnewlat(this.theuserid);
            this.long=await this.allLinks.getnewlng(this.theuserid);
            this.userposition.setLatLng([this.lat,this.long])
            this.score=await this.getscore()
            //this.let=lat
            //this.long=long
            const dist=((this.requesteddropofflat-this.lat)**2+(this.requesteddropofflong-this.long)**2)**0.5
            if(dist<0.003){
                this.requested=false
                await fetch('https://safe-river-16409.herokuapp.com/api/changerequestedfalse',{ credentials: 'include'})
                if(this.score==oldscore){
                    await this.waitfordriver(oldscore)
                }
            }
            else{
                await this.checkriderdest()
            }
        },
        async acgiveride(n,name,rplat,rplong,rdlat,rdlong){
            this.lat=await this.allLinks.getnewlat(this.theuserid);
            this.long=await this.allLinks.getnewlng(this.theuserid);
            const dist=((rplat-this.lat)**2+(rplong-this.long)**2)**0.5
            const distmiles1=(((rplat-this.lat)*69.172)**2+((rplong-this.long)*(Math.cos(((rplat-this.lat)/2)*(Math.PI/180)))*69.172)**2)**0.5
            this.thegiveridepopups[n].setContent('Go to'+name+'('+distmiles1+'miles away)')
            if(dist<0.003){
                this.enroute=true
                const distmiles=(((rplat-rdlat)*69.172)**2+((rplong-rdlong)*(Math.cos(((rplat-rdlat)/2)*(Math.PI/180)))*69.172)**2)**0.5
                this.cost=distmiles
                this.thegiveridepopups[n].setContent('Drive'+name+'to the destination('+distmiles+'miles away)')
                await this.checkdest(n,name,rdlat,rdlong)
            }
            else{
                await this.acgiveride(n,name,rplat,rplong,rdlat,rdlong)
            }
        },
        async getgive(){
            const response=await fetch('https://safe-river-16409.herokuapp.com/api/getusergive',{ credentials: 'include'})
            return response.json()
        },
        async beforeacgiveride(n,name,rplat,rplong,rdlat,rdlong){
            const theuserid = await this.use();
            this.theuserid=theuserid.id
            if(this.theuserid==undefined&&this.loggedin==false){
                window.location.assign("https://safe-river-16409.herokuapp.com/api/auth/login")
                this.loggedin=true
                await this.beforeacgiveride(n,name,rplat,rplong,rdlat,rdlong)
            }
            else if(this.theuserid==undefined&&this.loggedin==true){
                const theuserid = await this.use();
                this.theuserid=theuserid.id
                await this.beforeacgiveride(n,name,rplat,rplong,rdlat,rdlong)
            }
            else{
                this.givingans=await this.getgive()
                if(this.givingans.giving==undefined){
                    this.giving=false
                }
                else if(this.givingans.giving=='False'){
                    this.giving=false
                }
                else{
                    this.giving=true
                }
                console.log(this.giving)
                if(this.givingans.requested==undefined){
                    this.requested=false
                }
                else if(this.givingans.requested=='False'){
                    this.requested=false
                }
                else{
                    this.requested=true
                }
                if(this.giving==false&&this.requested==false){
                    this.giving=true
                    await fetch('https://safe-river-16409.herokuapp.com/api/changegive',{ credentials: 'include'})
                    await this.acgiveride(n,name,rplat,rplong,rdlat,rdlong)
                }
                else if(this.giving==true&&this.requested==false){
                    L.DomEvent.on(this.okbtns[n], 'click', () => {
                        this.goback(n)
                    });
                    var newDiv = document.createElement("div");
                    var newContent = document.createTextNode("Error: you must complete your current ride first.");
                    newDiv.appendChild(newContent);
                    newDiv.appendChild(this.okbtns[n]);
                    this.thegiveridepopups[n].setContent(newDiv)
                }
                else{
                    L.DomEvent.on(this.okbtns[n], 'click', () => {
                        this.goback(n)
                    });
                    var newwDiv = document.createElement("div");
                    var newwContent = document.createTextNode("Error: you must cancel your current ride request or complete it in order to give a ride.");
                    newwDiv.appendChild(newwContent);
                    newwDiv.appendChild(this.okbtns[n]);
                    this.thegiveridepopups[n].setContent(newwDiv)
                }
            }
        },
        async giveride(n,val,name,rplat,rplong,rdlat,rdlong){
            this.riderid=val
            L.DomEvent.on(this.yesbtns[n], 'click', () => {
                this.beforeacgiveride(n,name,rplat,rplong,rdlat,rdlong)
            });
            L.DomEvent.on(this.nobtns[n], 'click', () => {
                this.goback(n)
            });
            var newDiv = document.createElement("div");
            var newContent = document.createTextNode("Are your sure? Other users can tell if you failed to complete this ride.");
            newDiv.appendChild(newContent);
            newDiv.appendChild(this.yesbtns[n]);
            newDiv.appendChild(this.nobtns[n]);
            this.thegiveridepopups[n].setContent(newDiv)
        },
        async checkdest(n,val,rdlat,rdlong){
            const riderlat=await this.getriderlat(this.riderid);
            const riderlong=await this.getriderlong(this.riderid);
            this.lat=await this.allLinks.getnewlat(this.theuserid);
            this.long=await this.allLinks.getnewlng(this.theuserid);
            this.userposition.setLatLng([this.lat,this.long])
            const dist=((riderlat-rdlat)**2+(riderlong-rdlong)**2)**0.5
            const distmiles=(((riderlat-rdlat)*69.172)**2+((riderlong-rdlong)*(Math.cos(((riderlat-rdlat)/2)*(Math.PI/180)))*69.172)**2)**0.5
            if(dist<0.003){
                this.giving=false
                await fetch('https://safe-river-16409.herokuapp.com/api/changegivefalse',{ credentials: 'include'})
                await fetch('https://safe-river-16409.herokuapp.com/api/finished?cost='+this.cost+'&rider='+this.riderid,{ credentials: 'include'})
                this.score=await this.getscore()
            }
            else{
                this.thegiveridepopups[n].setContent('Drive'+val+'to the destination('+distmiles+'miles away)')
                this.thegiveridepopups[n].setLatLng([riderlat,riderlong])
                await this.checkdest(rdlat,rdlong)
            }
        },
        async use(){
            const response=await fetch('https://safe-river-16409.herokuapp.com/api/user',{ credentials: 'include'})
            return response.json()
        },
        goback(n){
            this.thegiveridepopups[n].setContent(this.thebtns[n])
        },
        confirm(val){
            this.thepopup.setLatLng([val.latlng.lat+(0.003/(this.map.getZoom()**9))*(13**9),val.latlng.lng])
            //this.map.openPopup('<b-button id="test" @click="test">test</b-button>',[val.latlng.lat+0.003,val.latlng.lng],{closeButton: false, closeOnClick: false})
            var container = L.DomUtil.create('div')
            var btn = L.DomUtil.create('button', '', container);
            var btn2 = L.DomUtil.create('button', '', container);
            btn.setAttribute('type', 'button');
            btn2.setAttribute('type', 'button');
            btn.innerHTML = 'confirm pickup';
            btn2.innerHTML = 'cancel';
            L.DomEvent.on(btn, 'click', () => {
                this.conpick()
            });
            L.DomEvent.on(btn2, 'click', () => {
                this.thepopup.remove()
                this.pickuploc.remove()
                this.otherreqstatus=false
            });
            var newDiv = document.createElement("div");
            newDiv.appendChild(btn);
            newDiv.appendChild(btn2);
            this.thepopup.setContent(newDiv)
            this.thepopup.openOn(this.map)
        },
        confirm2(val){
            this.thepopup.setLatLng([val.latlng.lat+(0.003/(this.map.getZoom()**9))*(13**9),val.latlng.lng])
            //this.map.openPopup('<b-button id="test" @click="test">test</b-button>',[val.latlng.lat+0.003,val.latlng.lng],{closeButton: false, closeOnClick: false})
            var container = L.DomUtil.create('div')
            var btn = L.DomUtil.create('button', '', container);
            var btn2 = L.DomUtil.create('button', '', container);
            btn.setAttribute('type', 'button');
            btn2.setAttribute('type', 'button');
            btn.innerHTML = 'confirm dropoff';
            btn2.innerHTML = 'cancel';
            L.DomEvent.on(btn, 'click', async () => {
                await this.condrop()
            });
            L.DomEvent.on(btn2, 'click', () => {
                this.reqpickuploc.remove()
                this.thert.remove()
                this.thepopup.remove()
                this.pickuploc.remove()
                this.otherreqstatus=false
            });
            var newDiv = document.createElement("div");
            newDiv.appendChild(btn);
            newDiv.appendChild(btn2);
            this.thepopup.setContent(newDiv)
            this.thepopup.openOn(this.map)
        },
        changepop(){
            this.thepopup.setLatLng([this.pickuploc.getLatLng().lat+(0.003/(this.map.getZoom()**9))*(13**9), this.pickuploc.getLatLng().lng])
        },
        async setpickup(){
            if(this.theuserid==undefined){
                this.requested=false
            }
            else{
                this.givingans=await this.getgive()
                console.log(this.givingans.requested)
                if(this.givingans.requested==undefined){
                    this.requested=false
                }
                else if(this.givingans.requested=='False'){
                    this.requested=false
                }
                else{
                    this.requested=true
                }
            } 
            if(this.requested==false&&this.otherreqstatus==false){
                this.otherreqstatus=true
                let pinIcon = L.icon({
                    iconUrl: image,
                    iconSize: [20,20],
                    iconAnchor: [10.5,20]
                });
                this.pickuploc = L.marker([this.lat, this.long], {
                    icon: pinIcon,
                    draggable: 'True'
                }).addTo(this.map);
                this.provider = new OpenStreetMapProvider();
                this.searchControl = new GeoSearchControl({
                    provider: this.provider,
                    showMarker: false
                });
                this.map.addControl(this.searchControl);
                this.map.on('geosearch/showlocation', this.work);
                //this.map.openPopup('<p>test</p>',[this.pickuploc.getLatLng().lat+0.003,this.pickuploc.getLatLng().lng],{closeButton: false, closeOnClick: false})
                this.thepopup=L.popup({closeButton:false,closeOnClick:false});
                this.thepopup.setLatLng([this.lat+(0.003/(this.map.getZoom()**9))*(13**9), this.long])
                this.map.on('zoomend',this.changepop)
                //this.map.openPopup('<b-button id="test" @click="test">test</b-button>',[val.latlng.lat+0.003,val.latlng.lng],{closeButton: false, closeOnClick: false})
                var container = L.DomUtil.create('div')
                var btn = L.DomUtil.create('button', '', container);
                var btn2 = L.DomUtil.create('button', '', container);
                btn.setAttribute('type', 'button');
                btn2.setAttribute('type', 'button');
                btn.innerHTML = 'confirm pickup';
                btn2.innerHTML = 'cancel';
                L.DomEvent.on(btn, 'click', () => {
                    this.conpick()
                });
                L.DomEvent.on(btn2, 'click', () => {
                    this.pickuploc.remove()
                });
                var newDiv = document.createElement("div");
                newDiv.appendChild(btn);
                newDiv.appendChild(btn2);
                this.thepopup.setContent(newDiv)
                this.thepopup.openOn(this.map)
                this.pickuploc.on('move',this.confirm)
            }
            else if(this.otherreqstatus==true){
                alert('Already requesting, drag pin to set pickup location')
            }
            else{
                this.requested=false
                await fetch('https://safe-river-16409.herokuapp.com/api/changerequestedfalse',{ credentials: 'include'})
                this.reqstatus='request ride'
                this.otherreqstatus=false
                if(this.reqpickuploc!='test'){
                    this.reqpickuploc.remove()
                    this.reqdropoffloc.remove()
                    this.thert.remove()
                }
            }
        },
        async setupmap(){
            this.map = L.map('mapContainer').setView([this.lat, this.long], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(this.map);
            this.userposition = L.circle([this.lat, this.long], {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 25,
            }).addTo(this.map);
            const thedat=await this.getrides()
            var j=0
            //console.log(thedat[0].Location36n79[0])
            for(let i=0;i<Object.values(thedat[0].Location36n79[0]).length;i++){
                this.values=Object.values(thedat[0].Location36n79[0])
                this.inds.push(j)
                //console.log(values[i])
                if(this.values[i][0].requestedpickuplat!=""&&this.values[i][0].requestedpickuplat!=undefined){
                    if(this.values[i][0].name!=this.theuserid){
                        var polygon = L.polygon([
                            [this.values[i][0].requestedpickuplat, this.values[i][0].requestedpickuplong],
                            [this.values[i][0].requesteddropofflat, this.values[i][0].requesteddropofflong]
                        ]).addTo(this.map);
                        //console.log(typeof(values[i][0]))
                        this.thegiveridepopups.push(L.popup({closeButton:false,closeOnClick:false}))
                        //values[i][0].append({ind:j})
                        var container=L.DomUtil.create('div')
                        this.thebtns.push(L.DomUtil.create('button', '', container));
                        this.thebtns[j].setAttribute('type', 'button');
                        this.thebtns[j].innerHTML = 'give ride';
                        L.DomEvent.on(this.thebtns[j], 'click', () => {
                            this.giveride(this.inds[i],this.values[i][0].name,this.values[i][0].acname,this.values[i][0].requestedpickuplat,this.values[i][0].requestedpickuplong,this.values[i][0].requesteddropofflat,this.values[i][0].requesteddropofflong)
                        });
                        this.yesbtns.push(L.DomUtil.create('button', '', container));
                        this.yesbtns[j].setAttribute('type', 'button');
                        this.yesbtns[j].innerHTML = 'Yes';
                        this.nobtns.push(L.DomUtil.create('button', '', container));
                        this.nobtns[j].setAttribute('type', 'button');
                        this.nobtns[j].innerHTML = 'No';
                        this.okbtns.push(L.DomUtil.create('button', '', container));
                        this.okbtns[j].setAttribute('type', 'button');
                        this.okbtns[j].innerHTML = 'OK';
                        this.thegiveridepopups[j].setContent(this.thebtns[j])
                        polygon.bindPopup(this.thegiveridepopups[j]);
                        let circle = L.circle([this.values[i][0].requestedpickuplat, this.values[i][0].requestedpickuplong], {
                            color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.5,
                            radius: 25,
                        }).addTo(this.map);
                        circle.bindPopup(this.thegiveridepopups[j])
                        let circle2 = L.circle([this.values[i][0].requesteddropofflat, this.values[i][0].requesteddropofflong], {
                            color: 'red',
                            fillColor: 'red',
                            fillOpacity: 0.5,
                            radius: 25,
                        }).addTo(this.map);
                        circle2.bindPopup(this.thegiveridepopups[j])
                        j+=1
                    }
                }
            }
        },
        addLink (newLink) {
            console.log(`EVENT: add new item ${newLink.name} to ${this.linkGroup.title}`);
            this.$emit('new-link', this.groupId, newLink);
            // may also do additional work related to logging, interactivity, or other tracking changes
        }
    },
    async mounted () {
        const theuserid=await this.use()
        this.theuserid=theuserid.id
        console.log(this.theuserid)
        const newlat=await this.allLinks.getnewlat(this.theuserid);
        const newlng=await this.allLinks.getnewlng(this.theuserid);
        this.lat=newlat
        this.long=newlng
        this.setupmap();
        this.isloading=''
        if(this.theuserid!=undefined){
            this.givingans=await this.getgive()
            this.score=await this.getscore()
            if(this.givingans.requested=='True'){
                this.reqstatus='Cancel request (5 mile penalty)'
                this.requested=true
                this.reqpickuploc=L.circle([this.givingans.requestedpickuplat, this.givingans.requestedpickuplong], {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    radius: 25,
                }).addTo(this.map);
                this.thert=L.polygon([
                    [this.givingans.requestedpickuplat, this.givingans.requestedpickuplong],
                    [this.givingans.requesteddropofflat, this.givingans.requesteddropofflong]
                ]).addTo(this.map);
                this.reqdropoffloc=L.circle([this.givingans.requesteddropofflat, this.givingans.requesteddropofflong], {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.5,
                    radius: 25,
                }).addTo(this.map);
                await this.checkriderdest()
            }
            else{
                this.requested=false
            }
            if(this.givingans.giving=='True'){
                this.giving==true
                await this.checkdest()
            }
            else{
                this.giving=false
            }
        }
        //const newlng=await this.allLinks.getlong();
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
<style scoped>
#mapContainer {
 width: 80vw;
 height: 100vh;
}
#request {
    position: absolute;
    bottom: 370px;
    width: 10%;
    z-index: 9999;
}
</style>