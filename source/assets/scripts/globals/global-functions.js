// consoleLog
// ---------------------------

/* This function can be used to display console logs in complicated scripts without having 
to strip the console logs from the project once it hits production.

Usage:

consoleLog(log, group);


log - This is the log you wish to display. This can be anything you would reguarly put in a console.log().
group - Allows you to add the console log to a specific group of logs that will only display if the selected group is active.
debug - You set this variable to 'true' or 'false' based on if you want to show console logs or not.
showGroups - This controls which group of console logs you want to show. 

* You might have to comment out the console.log() once you hit production (at least it is only one)*
*/


function consoleLog(log, type , group) {

    var debug               = true;

    var showWarn            = true,
        showError           = true,
        showNotification    = true,
        showEvent           = true,
        showFunction        = true,
        showAccept          = true,
        showMessage         = true,
        showEnd             = true,
        showObject          = true;

    var showTitle           = false;

    var showGroups          = ['default', 'configurator-validation', 'configurator-actions'];

    
    group = (typeof group === 'undefined') ? 'default' : group;
    type = (typeof type === 'undefined') ? 'default' : type;

    if(debug == true && showGroups.indexOf(group, 0) != -1) {
        if(type === 'warning' && showWarn) {
            var title = ((showTitle) ? 'warning:' : '');
            console.log(
                '%c \u26A0' + '%c ' + title + ' ' + log, 
                'color: #ff6600; font-size: 20px;', 'color: #ff6600'); // Orange
        }
        if(type === 'error' && showError) {
            var title = (showTitle) ? 'error:' : ''; 
            console.log(
                '%c \u2620' + '%c error: ' + log, 
                'color: #FF3300; font-size: 20px;', 'color: #FF3300'); // Red
        }
        else if(type === 'notification' && showNotification) {
            var title = (showTitle) ? 'notification:' : ''; 
            console.log(
                '%c \u26A0' + '%c ' + title + ' ' + log, 
                'color: #FFFF00; font-size: 20px;', 'color: #FFFF00'); // Yellow
        }
        else if(type === 'event' && showEvent) {
            var title = (showTitle) ? 'event:' : ''; 
            console.log(
                '%c \u23DA' + '%c ' + title + ' ' + log, 
                'color: #FF00FF; font-size: 20px;', 'color: #FF00FF'); // Fuchsia
        }
        else if(type === 'function' && showFunction) {
            var title = (showTitle) ? 'function:' : ''; 
            console.log(
                '%c \u222F' + '%c ' + title + ' ' + log, 
                'color: #9900CC; font-size: 18px;', 'color: #9900CC'); // Purple
        }
        else if(type === 'accept' && showAccept) {
            var title = (showTitle) ? 'accept:' : ''; 
            console.log(
                '%c \u2615' + '%c ' + title + ' ' + log, 
                'color: #33CC33; font-size: 22px;', 'color: #33CC33'); // Light Green
        }
        else if(type === 'message' && showMessage) {
            var title = (showTitle) ? 'message:' : ''; 
            console.log(
                '%c \u2630' + '%c ' + title + ' ' + log, 
                'color: #52CCCCF; font-size: 12px;', 'color: #52CCCCF'); // Light Blue
        }
        else if(type === 'end' && showEnd) {
            console.log(
                '%c \u2ADF' + ' ---end--- ' + log + ' ---end--- \u2ADF',
                 'padding-bottom: 11px; line-height: 2; color: #808080;'); // Grey
        }
        else if(type === 'object' && showObject) {
            console.log(log);
        }
        else {
            console.log(log);
        }
    }
}


// Get GET vars from url
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Get specific var from URL
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable) {return pair[1];}
    }
    return(false);
}


// Replace all
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


// Recursive function
var recursiveResult     = false;
function repeatUntilTrue(func) {
        
    setTimeout(function() {
        if(!recursiveResult) {
            consoleLog('repeatUntilTrue: ' + recursiveResult, 'message');
            func();
            repeatUntilTrue(func);
        }
        else {
            recursiveResult = false;
            consoleLog('Resetting: recursiveResult = ' + recursiveResult, 'message');
        }
    }, 250);
}

// filter data
// extends jQuery with .filterData(*searchterm*)
jQuery.fn.filterData = function(set) {
    var elems=jQuery([]);
    this.each(function(i,e) {
        jQuery.each( jQuery(e).data(), function(j,f) {
            if (j.substring(0, set.length) == set) {
                elems = elems.add(jQuery(e));
            }
        });
    });
    return elems;
}

// filter for duplicates in array
function unique(array){
    return $.grep(array,function(el,index){
        return index == $.inArray(el,array);
    });
}