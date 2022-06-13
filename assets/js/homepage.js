var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var displayRepos = function (repos, searchTerm) {
    repoContainerEl.textContent = "";
    repoSearchTerm.innerText = searchTerm; //innerText or textContent?

    if(repos.length===0){
        repoContainerEl.textContent="No respositories found.";
        return;
    }

    for (var i = 0; i < repos.length; i++) {
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        var repoQuery = "?repo="+repoName;
        repoEl.setAttribute("href","./single-repo.html" + repoQuery); 
        //when you create links to HTML pages in JavaScript, make sure the paths are relative to the HTML pages, not the JavaScript file.

        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        repoEl.appendChild(titleEl);

        var countEl = document.createElement("span");
        countEl.classList = "flex-row align-center";

        if (repos[i].open_issues_count > 0) {
            countEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            countEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(countEl);
        repoContainerEl.appendChild(repoEl);

    }
};

var getUserRepos = function (user) {
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    fetch(apiUrl)
        .then(function (response) {
            if(response.ok){
                response.json()
                .then(function (data) {
                    displayRepos(data, user);
                });
            } else{
                alert("Error: GitHub User Not Found");
            }  
        })
        .catch(function(error){
            // catch chained onto end of then method
            alert("Unable to connect to GitHub.");
        });
};

// you just need to know the username, the repository name, and how many issues the repository has.
// username - owner, then nested login
// repo name - name
// how many issues - open_issues_count vs open_issues

var formSubmitHandler = function (event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();

    // validation
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.")
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);