const messagingConfig = require("../config").messagingService
const request = require("request-promise-native");
const countryConfig = require("../config").countryConfig;

const makeRequest = (path, method, body, qs, headers = {}) => {

  console.log(`making request to ${messagingConfig.baseUrl}${path}`)

  const options = {
    url: messagingConfig.baseUrl + path,
    method,
    qs: qs || null,
    headers: headers || {},
    json: body || true,
  };
  return request(options);
};


module.exports.sendBulkPush = async (bulkRequest) => {
  for (let i = 0; i < bulkRequest.length; i++) {
    await makeRequest('/push', 'POST',
      {
        clientId: bulkRequest[i].clientId, messageKey: bulkRequest[i].messageKey,
        vars: bulkRequest[i].vars
      },
      null, {'X-Entity': countryConfig.ng.code, 'X-Locale-Lang': null});
  }
  return true;
};

module.exports.sendTemplateEmail = async (subject, sender, recipients, templateName, tags, globalMergeVars, base64String, fileName) => {
  try {
    return makeRequest('/email', 'POST', {
      messageTemplate: templateName,
      template_content: [],
      messageObject: {
        subject,
        from_email: sender,
        from_name: "Carbon",
        to: recipients,
        headers: {
          "Reply-To": sender,
        },
        track_opens: true,
        track_clicks: true,
        merge_language: "handlebars",
        global_merge_vars: globalMergeVars,
        tags,
        attachments: [
          {
            type: "text/csv",
            name: fileName,
            content: base64String
          }
        ]
      },
    });
  } catch (err) {
    console.error(`Error occurred sending mail: : ${err.message}`);
  }

}

