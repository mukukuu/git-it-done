var userFormEl = document.querySelector("#user-form");

var nameInputEl = document.querySelector("#username");

var repoContainerEl = document.querySelector("#repos-container");
var reposSearchTerm = document.querySelector("#repo-search-term");

//submit form ()
var formSubmitHandler = function(event) {
    //prevent page from refreshing
    event.preventDefault();
    //get value from input refreshing
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);

        //clear old content
        repoContainerEl.textContent ='';
        reposSearchTerm.textContent = searchTerm;
        nameInputEl.value = "";
    } else {
       alert("Please enter a GitHub username");
        
    } 
};

//get repos ()---------------------
var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    //get request to url
   
    fetch(apiUrl) 
        .then(function(response) {
            //request success
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert('Error: GitHub User Not Found');
            }
        })
        .catch(function(error) {
            //catch() chain to the end of .then()
            alert("Unable to connect to GitHub");
        });
        


getUserRepos("lernantino");

//show repos ()------------------
var displayRepos = function(repos,searchTerm) {
    //checkif api returned any repos
    if (repos.length ===0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    console.log(repos);
    console.log(searchTerm);


    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create a span element to hold repository name
        var titleEl = document.createElment("span");
        titleEl.textContent = repoName;

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList ="flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
             "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML =
            "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);
        }


        //append to container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};