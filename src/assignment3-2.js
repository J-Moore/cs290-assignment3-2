var gitList = [];

function displayGists() {

}

function appendResults(returnObj) {
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
}

function getGists() {
  var getPython, getJSON, getJavaScript, getSQL, pages, parameters;
  
  getList = [];
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