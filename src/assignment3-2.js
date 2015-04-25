var gitList = [];

function addToFavorite(favBtn) {
  var gistDiv = favBtn.parentNode.parentNode;
  
  console.log(gistDiv);
}

function displayGists() {
  var i, j;
  var gistDiv = document.getElementById("display-gists");
  
  gistDiv.innerHTML = "";
  
  for (i in gitList) {
    // make the div that will contain all info about the GIST
    var gTagNodeDiv = document.createElement('div');
    
    // dividing line
    var gNodeHR = document.createElement('hr');
    gTagNodeDiv.appendChild(gNodeHR);
    
    // favorite button
    var favoriteBtn = document.createElement('div');
    favoriteBtn.innerHTML = "<input type='button' value='+' onclick='addToFavorite(this);'/>";
    favoriteBtn.style.cssFloat = 'left';
    gTagNodeDiv.appendChild(favoriteBtn);
    
    // description of gist
    var gTagNodeP1 = document.createElement('p');
    var gTextNodeDescr = document.createTextNode(gitList[i]['description']);
    gTagNodeP1.appendChild(gTextNodeDescr);
    gTagNodeDiv.appendChild(gTagNodeP1);
    
    // url of gist
    var gTagNodeP2 = document.createElement('p');
    var gTagNodeA = document.createElement('a');
    var gTextNodeURL = document.createTextNode(gitList[i]['url']);
    gTagNodeA.appendChild(gTextNodeURL);
    gTagNodeA.href = gTextNodeURL;
    gTagNodeP2.appendChild(gTagNodeA);
    gTagNodeDiv.appendChild(gTagNodeP2);
    
    // list of flies and the language they are in
    var gFilesList = document.createElement('ul');
    for (j in gitList[i]['files']) {
      var gFileNameLI = document.createElement('li');
      var textContents = gitList[i]['files'][j]['filename'] + "  -  " + gitList[i]['files'][j]['language'];
      var gFileNameDescr = document.createTextNode(textContents);
      gFileNameLI.appendChild(gFileNameDescr);
      gFilesList.appendChild(gFileNameLI);
    }
    gTagNodeDiv.appendChild(gFilesList);

    
    // finally, append the div to gist div
    gistDiv.appendChild(gTagNodeDiv);
  }
}

function appendResults(returnObj) {
  var i, j;
  for (i in returnObj) {
    var files = [];
    var fentry = [];
    console.log(returnObj[i]);
    entryObj = {
      id: returnObj[i]['id'],
      url: returnObj[i]['url'],
      description: returnObj[i]['description']
    };
    
    if (entryObj['description'] == null) {
      entryObj['description'] == "<no description provided>";
    }
    
    for (j in returnObj[i]['files']) {
      if (!returnObj[i]['files'].hasOwnProperty(j)) {
        // do not want to loop through properties in the prototype
        continue;
      }
      fentry = {
        filename: j,
        language: returnObj[i]['files'][j]['language']
      };
      files.push(fentry);
    }
    
    entryObj['files'] = files;
    
    gitList.push(entryObj);
  }
  
  console.log("gitList objects stored:");
  console.log(gitList);
  
  displayGists();
}

function getGists() {
  var getPython, getJSON, getJavaScript, getSQL, pages, parameters;
  
  gitList = [];
  getPython = document.getElementsByName("language")[0].checked;
  getJSON = document.getElementsByName("language")[1].checked;
  getJavaScript = document.getElementsByName("language")[2].checked;
  getSQL = document.getElementsByName("language")[3].checked;
  numPages = document.getElementById("pages").value;
  
  parameters = {
    showPython: getPython,
    showJSON: getJSON,
    showJavaScript: getJavaScript,
    showSQL: getSQL,
    per_page: numPages * 30
  };

  
  console.log(parameters);
  getRequest(parameters, 1);
  
  if (parameters['per_page'] > 100) {
    getRequest(parameters, 2);
    
    console.log(parameters);
  }
  
}

function getRequest(parameters, page) {
  var url = 'https://api.github.com/gists/public';
  var per_page = parameters['per_page'];
  if (per_page > 100) {
    per_page = 100;
  }
  url += '?' + "page=" + page + "&per_page=" + per_page;
  console.log(url);

  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to create Http request';
  }

  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      var gistObj = JSON.parse(this.responseText);
      console.log(gistObj);
      appendResults(gistObj);
    }
  };

  req.open('GET', url);
  req.send();
}