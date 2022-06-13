var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function () {
    var repoSelected = document.location.search.split("=")[1];
    // if (!repoSelected.split("/")[1]) { //if there is no repo name, and it is empty, it evaluates to false--so if NOT false, i.e. it's true that there is no repo name
    //     alert("You need to have a valid repository name.");
    //     return;
    // }
    if (repoSelected) {
        repoNameEl.textContent = repoSelected;
        getRepoIssues(repoSelected);
    } else {
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function (repo) {
    // where repo will be username/repo_name, like "lillielovatt/challenge-1"
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function (response) {
        if (response.ok) { //indicates a successful request
            response.json().then(function (data) {
                displayIssues(data);
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            document.location.replace("./index.html");
            // alert("There was a problem with your request!");
        }
    });
};

var displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "No open issues in this repository.";
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // hyperlink with URL for issue we got from the apiUrl
        issueEl.setAttribute("href", issues[i].html_url);
        // opens the URL above in a new tab instead of replacing current webpage
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if: issue, or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        // append to issues container
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function (repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    limitWarningEl.appendChild(linkEl);
}


getRepoName();

