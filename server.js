/*
 * This represents a server that provides JSON data when asked.
 *
 * @author Dennis Quan
 * @author Robert Duvall
 */
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const cors = require('cors');
const serveStatic = require('serve-static')

const DataStore = require('./DataStore.js');
const PORT = process.env.PORT || 3000;

// make a generic server
const app = express();
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(serveStatic("./dist/index.html"));
// log all requests made to the server
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// allow connections from anywhere
/*
const corsGitlab = cors({
    origin: 'https://compsci290_2021spring.dukecs.io',
    credentials: true,
});
app.use(corsGitlab);
*/
app.use(express.json());
morganBody(app, {
  logRequestBody: true,
  logAllReqHeader: true,
  logResponseBody: true,
  logAllResHeader: true,
});
const auth = require('./authentication.js');
auth.setupAuthentication(app);
const { OAUTH } = require('./secrets.js');

// set up URL responses:
// provide some response to visiting the server directly (i.e., its homepage)
app.get('/',
    (req, res) => {
        res.send(`<a href="api/getLinks">Get the Data!</a>`);
    });
// return the JSON data that used to be fetched directly from the frontend
app.get('/api/getLinks',
    async (req, res) => {
        //console.log(66)
        res.status(200);
        //console.log(77)
        let jsondata=await getdata()
        //console.log(88)
        res.json(jsondata);
    });
app.get(
    '/api/user',
    (req, res) => {
        console.log(req.user?.id)
        const id=req.user?.id
        console.log(9)
        console.log(id)
        res.json({id})
        // extract out the useful parts of the req.user object
        /*
        const email = req.user?.emails ? req.user.emails[0].value : null;
        res.json({
            id,
            color: colors[`user:${id}`],
            displayName: req.user?.displayName,
            email,
            isAdmin: adminEmailAddresses.includes(email),
            photo: req.user?.photos?.length >= 1 ? req.user.photos[0].value : null,
        });
        */
    },
);
app.get('/api/getriderlat',
    async (req, res) => {
        let lat= await DataStore.getriderlat(req.query.id)
        res.json(lat);
    });
app.get('/api/getriderlong',
    async (req, res) => {
        let long= await DataStore.getriderlong(req.query.id)
        //console.log(long)
        res.json(long);
    });
app.get('/api/sendlat',
    async (req, res) => {
        console.log(req.query.name)
        await DataStore.setlat(req.query.lat,req.query.name)
        res.json(9);
    });
app.get('/api/sendlong',
    async (req, res) => {
        await DataStore.setlong(req.query.long,req.query.name)
        res.json(9);
    });
app.get('/api/changegive',
    async (req, res) => {
        await DataStore.changegive(req.user?.id)
        res.json(9);
    });
app.get('/api/changegivefalse',
    async (req, res) => {
        await DataStore.changegivefalse(req.user?.id)
        res.json(9);
    });
app.get('/api/getusergive',
    async (req, res) => {
        const ans=await DataStore.getusergive(req.user?.id)
        res.json(ans);
    });
app.get('/api/changerequested',
    async (req, res) => {
        await DataStore.changerequested(req.user?.id)
        res.json(9);
    });
app.get('/api/changerequestedfalse',
    async (req, res) => {
        await DataStore.changerequestedfalse(req.user?.id)
        res.json(9);
    });
app.get('/api/finished',
    async (req, res) => {
        let cost=req.query.cost
        let userid=req.user?.id
        let riderid=req.query.rider
        await DataStore.sendmiles(cost,userid,riderid)
        res.json(cost);
    });
app.get('/api/sendride',
    async (req, res) => {
        let name=req.user?.id
        let requestedpickuplong=req.query.requestedpickuplong;
        let requestedpickuplat=req.query.requestedpickuplat
        let requesteddropofflong=req.query.requesteddropofflong;
        let requesteddropofflat=req.query.requesteddropofflat
        res.status(200);
        //console.log(77)
        const rideans=await DataStore.sendride(name,requestedpickuplong,requestedpickuplat,requesteddropofflong,requesteddropofflat)
        res.json(rideans)
        //console.log(88)
        //res.json(jsondata);
    });
app.get('/api/sendmiles',
    async (req, res) => {
        let name=req.user?.id
        let riderid=req.query.riderid
        let cost=req.query.cost
        await DataStor.sendmiles(cost,name,riderid)
    });
app.get('/api/grabscore',
    async (req, res) => {
        let name=req.user?.id
        let snap=await DataStore.grabscore(name)
        res.json(snap)
    });
async function getdata(){
    const jsondata= await DataStore.getData()
    //jsondata[0].Location36n79[0].curlat=lat;
    //jsondata[0].Location36n79[0].curlong=long;
    return jsondata;
}
