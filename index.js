const core = require('@actions/core');
const github = require('@actions/github');
const { context } = require('@actions/github');
const btoa = require('btoa');
const fetch = require('node-fetch');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const twUri = core.getInput('TEAMWORK_URI');
const twApiKey = core.getInput('TEAMWORK_API_KEY');
const twProjectId = core.getInput('TEAMWORK_PROJECT_ID');

//const { pull_request_review, action } = context.payload;
// const user = context.sender.login;
// const user_url = context.sender.url;

console.log(context);

let auth = btoa(`${twApiKey}:x`);
var myHeaders = new fetch.Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Basic ${auth}`);


function createComment(comment) {
    var raw = JSON.stringify({
        "comment": {
            "body": comment,
            "notify": "",
            "isprivate": false,
            "pendingFileAttachments": "",
            "content-type": "TEXT"
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${twUri}/tasks/${taskId}/comments.json`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log(`error adding a comment to the task: ${error}`));
}
