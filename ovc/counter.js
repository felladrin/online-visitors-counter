/**
 * Adds a function to be executed when window has finished loading.
 * @param func Function to be executed when window is ready.
 */
function initialize(func) {
  window.addEventListener("load", func, false);
}

/**
 * Gets the current directory of this script.
 * @returns {string} Current directory of this script.
 */
const onlineVisitorsCounterScriptPath = function () {
  const scripts = document.getElementsByTagName("script");
  let path = "";
  if (scripts && scripts.length > 0) {
    for (let i in scripts) {
      if (scripts[i].src && scripts[i].src.match(/\/counter\.js$/)) {
        path = scripts[i].src.replace(/(.*)\/counter\.js$/, "$1");
        break;
      }
    }
  }
  return path;
};

/** Updates the counter. */
function updateOnlineVisitorsCounter() {
  const page_title = window.document.title;
  const page_url = window.location.href;
  const xmlhttp = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      document.getElementById("online-visitors-counter").innerHTML =
        xmlhttp.responseText;
    }
  };

  xmlhttp.open(
    "POST",
    onlineVisitorsCounterScriptPath() + "/counter.php",
    true
  );
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(
    "page_title=" +
      encodeURIComponent(page_title) +
      "&" +
      "page_url=" +
      encodeURIComponent(page_url)
  );
  setTimeout(updateOnlineVisitorsCounter, 15000);
}

/** Creates the counter element, or adjust it if it already exists. */
function createOnlineVisitorsCounterElement() {
  const existingElement = document.getElementById("online-visitors-counter");

  if (existingElement === null) {
    // Only creates a new element if it does not exist yet.
    const button = document.createElement("a");
    button.id = "online-visitors-counter";
    button.title = "Click to see where is everybody!";
    button.href = "#";
    button.onclick = function () {
      createOnlineVisitorsListDiv();
      return false;
    };
    button.style.cssText =
      "z-index:100; position: fixed; bottom: 5px; right: 10px; background-color:transparent; -moz-border-radius:28px; -webkit-border-radius:28px; border-radius:28px; border:2px solid #8dc0e3; display:inline-block; cursor:pointer; color:#8dc0e3; font-family:Trebuchet MS; font-size:13px; padding:9px 15px; text-decoration:none;";
    document.body.appendChild(button);
  } else if (existingElement.tagName.toLowerCase() === "a") {
    // If it already exists, and it is an anchor, we just add some properties to it.
    existingElement.title = "Click to see where is everybody!";
    existingElement.href = "#";
    existingElement.onclick = function () {
      createOnlineVisitorsListDiv();
      return false;
    };
  }
}

/** Creates a div to show where are other visitors. */
function createOnlineVisitorsListDiv() {
  const existingList = document.getElementById("online-visitors-list");

  if (existingList !== null) {
    document.body.removeChild(existingList);
  }

  const onlineVisitorsList = document.createElement("div");
  onlineVisitorsList.id = "online-visitors-list";
  onlineVisitorsList.style.cssText =
    "top: 50%; left: 50%; width:50%; height:18em; margin-top: -9em; margin-left: -25%; -moz-border-radius:8px; -webkit-border-radius:8px; border-radius:8px; border:3px solid #8dc0e3; position:fixed; z-index:124;";

  const xmlhttp = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      onlineVisitorsList.innerHTML = xmlhttp.responseText;
      document.body.appendChild(onlineVisitorsList);
    }
  };
  xmlhttp.open("GET", onlineVisitorsCounterScriptPath() + "/list.php", true);
  xmlhttp.send();

  const closingDiv = document.createElement("div");
  closingDiv.style.cssText =
    "background: white; opacity: .5; position:fixed; top:0px; bottom:0px; left:0px; right:0px; z-index:123;";
  closingDiv.onclick = function () {
    document.body.removeChild(onlineVisitorsList);
    document.body.removeChild(closingDiv);
  };

  document.body.appendChild(closingDiv);
}

// Initializes the counter as soon as the page finishes loading.
initialize(function () {
  createOnlineVisitorsCounterElement();
  updateOnlineVisitorsCounter();
});
