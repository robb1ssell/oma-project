const axios = require('axios');
const config = require('../../config');
const baseUrl = config.sp_baseUrl;
const https = require('https');
var xml2js = require('xml-js');
//const options = config.certOptions;

const spListApiUrl = list => {
  return `${baseUrl}_api/web/lists/getByTitle('${list}')/items`
};

let agent = new https.Agent({
  rejectUnauthorized: false
});

const spConfig = {
  withCredentials: true,
  headers: {
    'Accept': "application/json;odata=verbose",
  }
};

module.exports = app => {

  app.get('/api/sp-list', (req, res) => {
    console.log(req.query.list)
    let list = req.query.list;


    axios.get(spListApiUrl(list), spConfig)
    .then(resp => {
      console.log(resp.data)
      res.send(resp.data);
    })
    .catch(err => {
      console.log(err);
    });
  })

  app.get('/api/sp-formdigest', (req, res) => {
  //helper function to create form digest in state if needed
    axios({
      method: 'POST',
      url: {/* Removed due to contract */},
      headers: {
        'Content-Type': 'application/json; odata=verbose',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Accept': "application/json;odata=verbose"
      },
      withCredentials: true,
      httpsAgent: agent
    })
    .then(resp => {
      let xml = resp.data;
      let data = xml2js.xml2js(xml, {compact: true, spaces: 4})
      
        console.log(data["d:GetContextWebInformation"]["d:FormDigestValue"]._text)
    })
    .catch(err => {
      console.log(err)
    })
  })
}