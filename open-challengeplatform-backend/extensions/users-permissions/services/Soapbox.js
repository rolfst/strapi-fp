/**
 * Service 'soapbox', for doing SOAP Requests to the CRM Webservice.
 *
 * lexicon:
 * "opvragen relatie" == "request userdata"
 */

const axios = require('axios')
const fs = require('fs')
const https = require('https')
const rtracer = require('cls-rtracer')

// Generate the XML "string" for security/authentication, to be used in the SOAP HEADER
const _getWsseAuth = () => {
  const soapConfig = strapi.config.currentEnvironment.soapbox
  return `<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <wsse:UsernameToken>
          <wsse:Username>${soapConfig.wsse.username}</wsse:Username>
          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${soapConfig.wsse.password}</wsse:Password>
        </wsse:UsernameToken>
    </wsse:Security>`
}

// generate the XML "string" to address KLD-RELATIE -> Request User Data, to be used in the SOAP HEADER
const _getOpvragenRelatieWSAs = () => {
  const soapConfig = strapi.config.currentEnvironment.soapbox
  return `<wsa:To soapenv:actor="${soapConfig.actor}">${soapConfig.relatie.wsaTo}</wsa:To>
           <wsa:Action soapenv:actor="${soapConfig.actor}">${soapConfig.relatie.opvragenAction}</wsa:Action>`
}

/**
 * @description use the kvkmasterid to request userdata from { Webservice -> CRM -> KLD-RELATIE-(2016) }
 */
async function opvragenRelatie(kvkmasterid = '') {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('OpvragenRelatie (SOAP/CRM)')

  const { CRMError } = strapi.config.functions['bc-errors']

  const soapConfig = strapi.config.currentEnvironment.soapbox

  const soapEnvelope = `<soapenv:Envelope xmlns:ns="${soapConfig.relatie.schemas}" xmlns:ns1="${
    soapConfig.relatie.schemas
  }" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <soapenv:Header>
      ${_getWsseAuth()}
      ${_getOpvragenRelatieWSAs()}
    </soapenv:Header>
    <soapenv:Body>
      <ns:opvragenRelatieRequest>
          <ns:identifier>${kvkmasterid}</ns:identifier>
      </ns:opvragenRelatieRequest>
    </soapenv:Body>
  </soapenv:Envelope>`

  // the https agent is required to enc/auth our odd POST/SOAP hybrid request @ the webservice.
  const agent = new https.Agent({
    rejectUnauthorized: false,
    strictSSL: false,
    pfx: fs.readFileSync(__dirname + '/../../../etc/' + soapConfig.cert.file),
    passphrase: soapConfig.cert.pp
  })

  try {
    /**
     * use Axios to create a POST request that is actually XML/UTF-8, including the previously generated
     * "soapEnvelope" XML string && the httpsAgent.
     * @returns { String, format: XML }
     */
    const { data } = await axios({
      url: soapConfig.host,
      method: 'post',
      httpsAgent: agent,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: soapConfig.relatie.opvragenAction
      },
      data: soapEnvelope,
      httpsAgent: agent,
      timeout: 60000
    })
    return data
  } catch (err) {
    log.warn('error during OpvragenRelatie(CRM)')
    console.log(err)
    throw new CRMError(err.message)
  }
}

module.exports = {
  opvragenRelatie
}
