const core = require('@actions/core');
const github = require('@actions/github');
const { context } = require('@actions/github');
const btoa = require('btoa');
const fetch = require('node-fetch');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const twUri = core.getInput('TEAMWORK_URI');
const twApiKey = core.getInput('TEAMWORK_API_KEY');
const twProjectId = core.getInput('TEAMWORK_PROJECT_ID');

function getTaskId(body) {
    const parts = body.split('/');
    return parts.at(-1);
}

const { review, pull_request, action } = context.payload;
console.log(review);
console.log(pull_request);
console.log(action);
const user = review.user.login;
const user_url = review.user.url;
const review_comment = review.comment;
const pr_url = review.pull_request_url;
const pr_title = pull_request.title;
const taskId = getTaskId(pull_request.body);
const base_ref = pull_request.base.ref;
const head_ref = pull_request.head.ref;



let auth = btoa(`${twApiKey}:x`);
var myHeaders = new fetch.Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Basic ${auth}`);


function createComment(comment) {
    var comment = `**[${user}](${user_url})** submitted a review in PR: **${pr_title}**
    action: **${action}**
    ${review_comment}
    [${pr_url}](${pr_url})
    ${base_ref} <- ${head_ref}`;
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

createComment();