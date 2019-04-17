/**
 * @OnlyCurrentDoc
 */

var headings;
var cast;
var descriptions;

function doGet(request) {
  var data = request.parameter;
  var page;
  var mode = HtmlService.XFrameOptionsMode.ALLOWALL;
  
  switch(data.page){
    case 'reviews':
      page = 'Reviews';
      break;
    case 'productions':
      page = 'Productions';
      break;
    default:
      page = 'Index';    
  }

  return HtmlService
    .createTemplateFromFile('views/' + page)
    .evaluate()
    .setXFrameOptionsMode(mode);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function Hash (title,year) {
  var title
  var year
  var input = title.toString() + year.toString();
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  var txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

// Get data for the reviews page.
function getReviewData(colYear,colTitle) {
  var colYear = colYear||1;
  var colDate = 2;
  var colTitle = colTitle||3;
  
  var data = SpreadsheetApp
      .getActive()
      .getSheetByName('Reviews')
      .getDataRange()
      .getValues();

  data.shift();
  
//  // Sort by title (second sort criteria)
//  data.sort(
//    function(a,b){
//      var x = a[colTitle];
//      var y = b[colTitle];
//      return x < y ? -1 : x > y ? 1 : 0;  // return 0 if equal, 1 if > and -1 if <
//    });
//  // Sort by year (first sort criteria)
//  data.sort(
//    function(b,a){
//      var x = a[colYear];
//      var y = b[colYear];
//      return x < y ? -1 : x > y ? 1 : 0;  // return 0 if equal, 1 if > and -1 if <
//    });
  // Sort by date (first sort criteria)
  data.sort(
    function(b,a){
      var x = a[colDate];
      var y = b[colDate];
      return x < y ? -1 : x > y ? 1 : 0;  // return 0 if equal, 1 if > and -1 if <
    });
  
  return data; 
}

// Get data for the productions page.
function getProductionData() {
  cast = SpreadsheetApp.getActive().getSheetByName('Cast').getDataRange().getValues();
  cast.shift();
  
  var sheet = SpreadsheetApp
      .getActive()
      .getSheetByName('Productions');

  var idx = getColumnIndex('Title');
  var range = sheet.getDataRange()
  var data = range
      .getValues()
      .filter(
        function(element){
          return element[this] !== ""
        }, idx)
  
  // Drop the header row.
  data.shift();
  
  var colYear = getColumnIndex('Year');
  var colDate = getColumnIndex('Date');
  
  // Sort by date (second sort criteria)
  data.sort(
    function(b,a){
      var x = a[colDate];
      var y = b[colDate];
      return x < y ? -1 : x > y ? 1 : 0;  // return 0 if equal, 1 if > and -1 if <
    });
  // Sort by year (first sort criteria)
  data.sort(
    function(b,a){
      var x = a[colYear];
      var y = b[colYear];
      return x < y ? -1 : x > y ? 1 : 0;  // return 0 if equal, 1 if > and -1 if <
    });
  
  return data;
  
  /*
  // Sort by date (column 2) when we have all dates available.
  return data.sort(
    function(a,b){
      var x = a[idx];
      var y = b[idx];
      return x < y ? -1 : x > y ? 1 : 0;  // return 0 if equal, 1 if > and -1 if <
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    }, idx);
    */
}

// If there is data then return the label and data otherwise return empty.
function getTR(template,label,data){
  if (data == ""){ return ""; }
  var text = Utilities.formatString(template, label, data);
  return text;
}

// Convert the column name into an index number.
function getColumnIndex(title){
  var sheet;
  if(!headings){
    sheet = SpreadsheetApp.getActive().getActiveSheet();
    headings = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  }
  var idx = headings.indexOf(title);
  return idx;
}

function getDescription(id){
  id = id||'0a02ec82b4c128af1ae595cd31df176b';
  if(!descriptions){
    descriptions = SpreadsheetApp
    .getActive()
    .getSheetByName('Descriptions')
    .getDataRange()
    .getValues()
    descriptions.shift();
  }
  var data = descriptions.filter(
    function(row){
      return row[0] == id;
    }, id);
  if(data.length == 0) return '';
  return data[0][3];
}

function getTRCast(template,title,year){
  var data = cast.filter(
    function(element){
      return element[1] == title && element[0] == year;
    }, title);
  var html = '';
  for(i = 0; i < data.length; i++){
    html += Utilities.formatString(template, data[i][2], data[i][3]);
  }
  if(html) return '</table><hr/><table>' + html; 
  return '';
}

// Format a date for display on the web page.
function formatDate(date){
  if(Object.prototype.toString.call(date) !== '[object Date]') return 'No date found';
  return Utilities.formatDate(date, "Europe/London", "EE d MMMM, yyyy");
}

// Split the text at each carriage return and surround with paragraph HTML.
function formatParagraph(text,postfix){
  /**
  * Split the text at each carriage return and surround with paragraph HTML.
  * Join everything up and return the string.
  **/
  if(Object.prototype.toString.call(text) !== '[object String]') return 'NaS';
  if(!text) return '';
  
  var lines = text.split("\n");
  var res = "<p>" + lines.join("</p><p>") + "</p>";
  if(!postfix) return res;
  return res + postfix;
}
