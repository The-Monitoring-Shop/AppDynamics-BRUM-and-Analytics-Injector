chrome.permissions.getAll(permissions => {
  console.log(permissions)
  if(!permissions.origins.includes('http://*/*') && !permissions.origins.includes('https://*/*')) {
    document.getElementById("permissionsHint").style.display = 'block'
    document.getElementById("grantAllPermissions").style.display = 'inline-block'
  }
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "updateToggleSwitch"){
            updateToggleSwitch();
        }
    }
);

function openOptionsPage() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "/options.html",
            index: tabs[0].index + 1,
            active: true,
            openerTabId: tabs[0].id
        });
        window.close();
    });
}

function getActiveTabURL() {
    var activeURL;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        activeURL = tabs[0].url.split("?")[0];
        document.getElementById("url").value = activeURL;
        addExistingData();
    });
}

function grantAllPermissions() {
  console.log('Granting permissions...')
  chrome.permissions.request({
      origins: ['http://*/*', 'https://*/*']
    }, function (granted) {
      console.log(granted)
      if(granted) {
        document.getElementById("permissionsHint").style.display = 'hidden'
        document.getElementById("grantAllPermissions").style.display = 'hidden'
      }
    })
}


function updateToggleSwitch() {
    chrome.storage.local.get("injectionSwitch", function(b) {
        if (1 == b.injectionSwitch) {
            document.getElementById("status").innerHTML = "Injection is On";
        } else {
            document.getElementById("status").innerHTML = "Injection is Off";
        }
    })
}

function toggleSwitch() {
    chrome.storage.local.get("injectionSwitch", function(b) {
        if (0 == b.injectionSwitch || null == b.injectionSwitch) {
            chrome.storage.local.set({
                injectionSwitch: 1
            })
            document.getElementById("status").innerHTML = "Injection is On";
            chrome.browserAction.setBadgeText({
                text: "On"
            });
        } else {
            chrome.storage.local.set({
                injectionSwitch: 0
            })
            document.getElementById("status").innerHTML = "Injection is Off";
            chrome.browserAction.setBadgeText({
                text: "Off"
            });
        }

        chrome.runtime.sendMessage({
            message: "updateToggleSwitch"
        });
    })
}

function addRowToTable(isExisting, userDataConfig){
    var table = document.getElementById("userDataConfigTable");

    var newRowIndex = table.rows.length;
    var newRow = table.insertRow();

    //ADD KEY
    var newCell = newRow.insertCell();
    newCell.width = "20%";
    var keyBox = document.createElement("input");
    keyBox.type = "text";
    keyBox.name = "k" + newRowIndex;
    keyBox.id = "k" + newRowIndex;
    if(isExisting){keyBox.value = userDataConfig.key;}
    newCell.appendChild(keyBox);

    //ADD TYPE
    var newCell = newRow.insertCell();
    newCell.width = "20%";
    var typeBox = document.createElement("select");
    typeBox.id = "t" + newRowIndex;
    typeBox.className = "dropdown";

    var op = new Option();
    op.value = "String";
    op.text = "String";
    if(isExisting && userDataConfig.type == "String"){op.selected = true;}
    typeBox.options.add(op);

    var op = new Option();
    op.value = "Long";
    op.text = "Long";
    if(isExisting && userDataConfig.type == "Long"){op.selected = true;}
    typeBox.options.add(op);

    var op = new Option();
    op.value = "Double";
    op.text = "Double";
    if(isExisting && userDataConfig.type == "Double"){op.selected = true;}
    typeBox.options.add(op);

    var op = new Option();
    op.value = "Boolean";
    op.text = "Boolean";
    if(isExisting && userDataConfig.type == "Boolean"){op.selected = true;}
    typeBox.options.add(op);

    var op = new Option();
    op.value = "Date";
    op.text = "Date";
    if(isExisting && userDataConfig.type == "Date"){op.selected = true;}
    typeBox.options.add(op);

    newCell.appendChild(typeBox);

    //ADD VALUE

    var newCell = newRow.insertCell();
    var valueBox = document.createElement("input");
    valueBox.type = "text";
    valueBox.name = "v" + newRowIndex;
    valueBox.id = "v" + newRowIndex;
    if(isExisting){valueBox.value = userDataConfig.value;}
    newCell.appendChild(valueBox);

    //ADD TEST BUTTON

    var newCell = newRow.insertCell();
    var testButton = document.createElement("button");
    testButton.id = "test" + newRowIndex;
    testButton.className = "button";
    testButton.innerText = "Test";
    newCell.appendChild(testButton);
    document.getElementById("test"+newRowIndex).addEventListener("click", function() {
        try{
            document.getElementById("testBox").value = eval(document.getElementById("v"+newRowIndex).value);
            document.getElementById("testBox").value += " (Type is " + typeof(eval(document.getElementById("v"+newRowIndex).value)) + ")";
        }
        catch(e){
            document.getElementById("testBox").value = e;
        }
    })

    //ADD REMOVE BUTTON

    var newCell = newRow.insertCell();
    var removeButton = document.createElement("button");
    removeButton.id = "remove" + newRowIndex;
    removeButton.className = "button";
    removeButton.innerText = "Remove";
    newCell.appendChild(removeButton);
    document.getElementById("remove"+newRowIndex).addEventListener("click", function() {
        newRow.remove()
    })
}

function addExistingData() {
    chrome.storage.local.get("pageConfigs", function(a) {
        var url = document.getElementById("url").value;
        if(a.pageConfigs[url] && a.pageConfigs[url].pageName != null && a.pageConfigs[url].pageName != ""){
            document.getElementById("pageName").value = a.pageConfigs[url].pageName;
        }
    });

    chrome.storage.local.get("userDataConfigs", function(a) {
        var url = document.getElementById("url").value;
        if(a.userDataConfigs[url] != null && a.userDataConfigs[url].length > 0){
                a.userDataConfigs[url].forEach(function(userDataConfig) {
                addRowToTable(true, userDataConfig);
            })
            renderUI();
        }
        else{
            console.debug("No user data for " + url);
        }
    });
}

function renderUI(){
    $(".button").button();
}

function saveUserData() {

    var url = document.getElementById("url").value;
    var pageName = document.getElementById("pageName").value;
    var userDataConfigTable = document.getElementById("userDataConfigTable");
    var rowsToSave = userDataConfigTable.rows.length;
    var saveErrors = false;

    chrome.storage.local.get("pageConfigs",function(a){

        if (a.pageConfigs[url] == null){
            a.pageConfigs[url] = new Object();
        }

        a.pageConfigs[url].pageName = pageName;

        console.debug(a.pageConfigs[url]);
        chrome.storage.local.set({"pageConfigs": a.pageConfigs});
    });

    chrome.storage.local.get("userDataConfigs",function(a){

        if (a.userDataConfigs[url] == null){
            a.userDataConfigs[url] = new Array();
        }

        for (i = 1; i < rowsToSave; i++) {

            var k = document.getElementById("k"+i).value;
            var t = document.getElementById("t"+i).value;
            var v = document.getElementById("v"+i).value;

            if(k != "" && t != "" && v != ""){
                var existingKey = a.userDataConfigs[url].find(function (obj) { return obj.key === k; });
                if (existingKey == null){
                    a.userDataConfigs[url].push({key: k, type: t, value: v});
                    console.debug(k + " - Doesn't exist so adding");
                }
                else{
                    var index = a.userDataConfigs[url].map(function(x){ return x.key; }).indexOf(k);
                    a.userDataConfigs[url].splice(index,1);
                    a.userDataConfigs[url].push({key: k, type: t, value: v});
                    console.debug(k + " - Does exist so replacing");
                }
                console.debug("Row Saved");
                console.debug(userDataConfigTable.rows[i]);
            }
            else{
                $( "#k"+i ).effect("highlight", null, 5000);
                $( "#v"+i ).effect("highlight", null, 5000);
                $( "#test"+i ).effect("shake", null, 2000);
                saveErrors = true;
            }

        }

        console.debug(a.userDataConfigs[url]);
        chrome.storage.local.set({"userDataConfigs": a.userDataConfigs});

        if(saveErrors){
            document.getElementById("userDataConfirm").innerText = " - Saved but there were some errors...";
        }
        else{
            document.getElementById("userDataConfirm").innerText = " - Saved!";
        }

        $("#userDataConfirm").fadeIn("slow");
        setTimeout('$("#userDataConfirm").fadeOut("slow")', 5000);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    });

}

function addUserDataRow() {
    addRowToTable(false, null);
    renderUI();
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("toggle").addEventListener("click", function() {
        toggleSwitch();
    })
    document.getElementById("grantAllPermissions").addEventListener("click", function() {
        grantAllPermissions();
    })
    document.getElementById("url").addEventListener("click", function() {
        $("#url").select();
    })
    document.getElementById("pageName").addEventListener("click", function() {
        $("#pageName").select();
    })
    document.getElementById("saveUserData").addEventListener("click", function() {
        saveUserData();
    })
    document.getElementById("insertRowButton").addEventListener("click", function() {
        addUserDataRow();
    })
    document.getElementById("openOptionsPage").addEventListener("click", function() {
        openOptionsPage();
    })
});

$(document).ready(function() {
    $("#accordion").accordion({
        heightStyle: "content",
        active: 0
    });

    var tooltips = $( "[title]" ).tooltip({
      position: {
        my: "left top",
        at: "right+5 top-5",
        collision: "none"
      }
    });

    getActiveTabURL();
    $(".button").button();

    chrome.storage.local.get("injectionSwitch", function(a) {
    	0 == a.injectionSwitch || null == a.injectionSwitch ? (document.getElementById("status").innerHTML = "Injection is Off") : (document.getElementById("status").innerHTML = "Injection is On")
	});

});
