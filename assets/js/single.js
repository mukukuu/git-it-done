var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

//--------------function to get reponame
var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

if(repoName) {
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
} else {
    //if no repo was given then redirect to home page
    document.location.replace("./index.html");
}
}

//---------------function to get repo issue
var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
             //pass response data to dom function
            displayIssues(data);

            //check if api has paginated issues
            if (response.headers.get("link")) {
                displayWarning();
            }
            });
        } else {
            //if not successful, redirect to homepage
            document.location.replace("./index.html");
        }        
    });   
};



//-----------------function to create dom to display issues
var displayIssues = function(issues) {

    //--show message if no issue open
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    //loop each issue to see their type
    for (var i = 0; i < issues.length; i++) {
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        //append to container
        issueEl.appendChild(titleEl);
        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }

};

//------------------function to show warning
var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContainer = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issue on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_vlank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();