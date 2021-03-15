// express based imports
const express = require('express');
const app = express();
const http = require('http').Server(app);

// other packages
const axios = require('axios');
const fs = require('fs');
const soapRequest = require('easy-soap-request');
const xml = require('xml');

// internal js imports
const { isValidIdentity } = require('./identity-check');

// constants
const port = process.env.PORT || 5005;
const baseUrl = '/api';
const xmlContentType = 'text/xml; charset=utf-8';

http.listen(port, () => {
    console.log(`Stubby running on port ${port}`)
});

app.get(baseUrl, (req, res) => {
    res.send({ message: 'welcome to Stubby' })
});

app.get(baseUrl + '/relatie', async (req, res) => {
    if (req.headers.kvkmasterid) {
        const xml = fs.readFileSync(__dirname + '/xml/crm-opvragen-relatie-v2.xml', 'utf-8');
        res.set({ 'content-type': xmlContentType });
        res.status(200).send(xml);
    } else {
        res.sendStatus(400)
    }
});

app.get(baseUrl + '/roles', async (req, res) => {
    if (req.headers.kvkmasterid) {
        res.set({ 'content-type': xmlContentType });
        res.status(200).sendFile('crm-opvragen-rollen.xml', { 'root': __dirname + '/xml/' })
    } else {
        res.sendStatus(400)
    }
});

app.get(baseUrl + '/checkId', async (req, res) => {
    if (req.headers.kvkmasterid && isValidIdentity(req.headers.kvkmasterid)) {
        res.status(200).send(true)
    } else {
        res.status(400).send(false)
    }
});



/////////////////////// ///////////////////////////
///////////// SoapTest & Fallback /////////////////
///////////////////// /////////////////////////////

app.get(baseUrl + '/soaptest', async (req, res) => {

    const url = 'https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php';
    const sampleHeaders = {
        'user-agent': 'easy-soap-request-test',
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: 'https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode',
    };
    const xmlFile = fs.readFileSync(__dirname + '/xml/soap-test.xml', 'utf-8');

    try {
        const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xmlFile, timeout: 1000 }); // Optional timeout parameter(milliseconds)
        const { headers, body, statusCode } = response;
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.status(statusCode).header(headers).send(body);
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }

});

app.get('*', async (req, res) => {
    res.status(204).send({ 'message': 'Welcome to the stubby fallback page.' })
});
