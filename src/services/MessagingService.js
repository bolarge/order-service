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
  let pushPromises = [];
  for (let i = 0; i < bulkRequest.length; i++) {
    pushPromises.push(buildPushRequest(bulkRequest[i]));
  }
  await Promise.all(pushPromises);
};

async function buildPushRequest(singleRequest) {
  makeRequest('/push', 'POST',
    {
      clientId: singleRequest.clientId, messageKey: singleRequest.messageKey,
      vars: singleRequest.vars
    },
    null, {'X-Entity': countryConfig.ng.code, 'X-Locale-Lang': null});
}

module.exports.sendTemplateEmail = async (subject, sender, recipients, templateName, tags, base64String, fileName, globalMergeVars = []) => {
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
    throw new Error('Error occurred sending mail');
  }

}

