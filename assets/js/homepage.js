//------form vals
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

//------DOM vals
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//-----btns vals
var languageButtonsEl = document.querySelector("#language-buttons");




//------------function to handle submit form
var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

//--------function for btns
var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");  {
          
      if (language) {
          getFeaturedRepos(language);
          //clear old content
          repoContainerEl.textContent = "";
      }
      }};
  
  
//------------function to sent request
var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
   // make a request to the url
   fetch(apiUrl)
   .then(function(response) {
       if (response.ok) {
           response.json().then(function(data) {
           displayRepos(data, user);        
       });
       
       } else {
           alert("Error: GitHub User Not Found");

       }    
   }) 
   //after .then
   .catch(function(error) {
      alert("Unable to connect to GitHub");
   });
};


//--------------------function to get featured repos
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) { 
            response.json().then(function(data) {
            displayRepos(data.items, language);
            });
            console.log(response);
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

//--------------------------function to display repos
var displayRepos = function(repos, searchTerm) {
    //check if api returend any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    //to clear old content----
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    console.log(repos);
    console.log(searchTerm);

    //loop over repos-----
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //add attribute to contain a href to single repo issue page
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        var titileEl = document.createElement("span");
        titileEl.textContent = repoName;
        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check if current repo has issues or not------
     if (repos[i].open_issues_count > 0) {
         statusEl.innerHTML = 
         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issues(s)";
     } else {
         statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
     }
        //append to container-------
        repoEl.appendChild(statusEl);

        //append to container-------
        repoEl.appendChild(titileEl);
        //append container to the dom------
        repoContainerEl.appendChild(repoEl);
    } 
};

// event listeners
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);