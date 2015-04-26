var gitList = [];
var favoriteList = [];

window.onload = function() {
  loadFavoritesFromStorage();
  displayFavorites();
}

function loadFavoritesFromStorage() {
  favoriteList = [];
  var readerArray = new Array();
  var fileNameArray = new Array();
  var files = [];
  var fentry = [];
  var favObj;
  var storageString = "";
  for (var i = 0; i < localStorage.length; i++) {
    files = [];

    // loop through local storage and grab favorited gists
    // (this probably isn't done the most efficient way but it
    // wasn't immediately clear how best to save this data locally
    storageString = localStorage.getItem(localStorage.key(i));
    //console.log(storageString);
    readerArray = storageString.split(",");
    //console.log(readerArray);

    // confirm that the object read in localStorage is in fact
    // a favorited gist string
    // (this could be made more robust...)
    if (readerArray.length < 4) {
      continue;
    }
    if (readerArray[0].length < 20) {
      continue;
    }

    favObj = {
      id: readerArray[0],
      url: readerArray[2],
      description: readerArray[1]
    };

    for (var j = 3; j < readerArray.length; j++) {
      fileNameArray = readerArray[j].split(":");
      fentry = {
        filename: fileNameArray[0],
        language: fileNameArray[1]
      };
      files.push(fentry);
    }

    favObj['files'] = files;
    favoriteList[readerArray[0]] = favObj;
  }

  //console.log(favoriteList);
}

function removeFavorite(unfavBtn) {
  //console.log("unfavorited");
  //console.log(unfavBtn);

  var gistID = unfavBtn.parentNode.className;
  var favDiv = unfavBtn.parentNode.parentNode;
  var gistDiv = document.getElementById("display-gists");
  var thisBtn = unfavBtn;

// the following can be improved but was easiest to code with existing functions

  // remove from localStorage
  localStorage.removeItem(gistID);

  // reload favorite list from storage
  loadFavoritesFromStorage();

  // display favorite list again
  displayFavorites();

  // display gist lists again
  displayGists();
}

function addToFavorite(favBtn) {
  var gistID = "" + favBtn.parentNode.className;
  var favDiv = document.getElementById("fav-gists");
  var gistDiv = favBtn.parentNode.parentNode;
  var thisBtn = favBtn;

  var storageString = "";

  // add to favoriteList
  favoriteList[gistID] = gitList[gistID];

  // store in local storage
  // format of string saved in local storage:
  // id , description , url , file:language (repeated as often as needed)
  storageString = storageString + gistID;
  storageString = storageString + "," + favoriteList[gistID]['description'];
  storageString = storageString + "," + favoriteList[gistID]['url'];
  for (fn in favoriteList[gistID]['files']) {
    storageString = storageString + "," +
                    favoriteList[gistID]['files'][fn]['filename'] +
                    ":" + favoriteList[gistID]['files'][fn]['language'];
  }
  //console.log(storageString);
  localStorage.setItem(gistID, storageString);
  //console.log(localStorage.length);

  // remove from gists Div (from displaying)
  gistDiv.parentNode.removeChild(gistDiv);

  // call 'display favorites' function
  displayFavorites();
}

function displayFavorites() {
  var i, j;
  var favDiv = document.getElementById("fav-gists");

  favDiv.innerHTML = "";

  for (i in favoriteList) {
    // make the div that will contain all info about the GIST
    var fTagNodeDiv = document.createElement('div');

    // dividing line
    var fNodeHR = document.createElement('hr');
    fTagNodeDiv.appendChild(fNodeHR);

    // unfavorite button
    var unfavoriteBtn = document.createElement('div');
    unfavoriteBtn.innerHTML = "<input type='button' value='-' onclick='removeFavorite(this);'/>";
    unfavoriteBtn.className = i;
    unfavoriteBtn.style.cssFloat = 'left';
    fTagNodeDiv.appendChild(unfavoriteBtn);

    // description of gist
    var fTagNodeP1 = document.createElement('p');
    var fTextNodeDescr = document.createTextNode(favoriteList[i]['description']);
    fTagNodeP1.appendChild(fTextNodeDescr);
    fTagNodeDiv.appendChild(fTagNodeP1);

    // url of gist
    var fTagNodeP2 = document.createElement('p');
    var fTagNodeA = document.createElement('a');
    var fTextNodeURL = document.createTextNode(favoriteList[i]['url']);
    fTagNodeA.appendChild(fTextNodeURL);
    fTagNodeA.href = fTextNodeURL;
    fTagNodeP2.appendChild(fTagNodeA);
    fTagNodeDiv.appendChild(fTagNodeP2);

    // list of flies and the language they are in
    var fFilesList = document.createElement('ul');
    for (j in favoriteList[i]['files']) {
      var fFileNameLI = document.createElement('li');
      var textContents = favoriteList[i]['files'][j]['filename'] + "  -  " + favoriteList[i]['files'][j]['language'];
      var fFileNameDescr = document.createTextNode(textContents);
      fFileNameLI.appendChild(fFileNameDescr);
      fFilesList.appendChild(fFileNameLI);
    }
    fTagNodeDiv.appendChild(fFilesList);

    // finally, append the div to favorites div
    favDiv.appendChild(fTagNodeDiv);
  }
}

function displayGists() {
  var i, j;
  var gistDiv = document.getElementById("display-gists");

  // for displaying languages
  var getPython = document.getElementsByName("language")[0].checked;
  var getJSON = document.getElementsByName("language")[1].checked;
  var getJavaScript = document.getElementsByName("language")[2].checked;
  var getSQL = document.getElementsByName("language")[3].checked;
  var filterChecked = getPython || getJSON || getJavaScript || getSQL
  var displayThis = false;


  gistDiv.innerHTML = "";

  for (i in gitList) {

    // if gist is already in favorite lists then skip it and do not display it
    if (!(typeof favoriteList[i] === 'undefined')) {
        //console.log(i, ": gist is already in favorites");
        continue;
    }

    // make the div that will contain all info about the GIST
    var gTagNodeDiv = document.createElement('div');

    // dividing line
    var gNodeHR = document.createElement('hr');
    gTagNodeDiv.appendChild(gNodeHR);

    // favorite button
    var favoriteBtn = document.createElement('div');
    favoriteBtn.innerHTML = "<input type='button' value='+' onclick='addToFavorite(this);'/>";
    favoriteBtn.className = i;
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

      // check language filters
      // if one file meets the language checked we display the gist
      if (gitList[i]['files'][j]['language'] != null) {
        if ((gitList[i]['files'][j]['language'].toLowerCase() === 'python') && (getPython)) {
          displayThis = true;
        }
        if ((gitList[i]['files'][j]['language'].toLowerCase() === 'json') && (getJSON)) {
          displayThis = true;
        }
        if ((gitList[i]['files'][j]['language'].toLowerCase() === 'javascript') && (getJavaScript)) {
          displayThis = true;
        }
        if ((gitList[i]['files'][j]['language'].toLowerCase() === 'sql') && (getSQL)) {
          displayThis = true;
        }
      }
    }
    gTagNodeDiv.appendChild(gFilesList);

    // finally, append the div to gist div
    if (!filterChecked || (filterChecked && displayThis)) {
      gistDiv.appendChild(gTagNodeDiv);
    }
    displayThis = false;
  }
}

function appendResults(returnObj) {
  var i, j;
  for (i in returnObj) {
    var files = [];
    var fentry = [];
    //console.log(returnObj[i]);
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

    gitList[returnObj[i]['id']] = entryObj;
  }

  //console.log("gitList objects stored:");
  //console.log(gitList);

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

  //console.log(parameters);
  getRequest(parameters, 1);

  if (parameters['per_page'] > 100) {
    getRequest(parameters, 2);

    //console.log(parameters);
  }

}

function getRequest(parameters, page) {
  var url = 'https://api.github.com/gists/public';
  var per_page = parameters['per_page'];
  if (per_page > 100) {
    per_page = 100;
  }
  url += '?' + "page=" + page + "&per_page=" + per_page;
  //console.log(url);

  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to create Http request';
  }

  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      var gistObj = JSON.parse(this.responseText);
      //console.log(gistObj);
      appendResults(gistObj);
    }
  };

  req.open('GET', url);
  req.send();
}