//Disable enter button for html form submit
window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13){if(e.target.nodeName=='INPUT'&&e.target.type=='text'){e.preventDefault();return false;}}},true)

//makes the request to php, which acquires and returns the correct countries JSON
function makeRequest(buttonKey) {
  //blank input, error
  if(document.getElementById("valueInput").value == "") {
    alert("Please enter search criteria.");
  }
  else {
    document.getElementById("results").innerHTML = "";
    //Append to and submit formdata as an xmlhttprequest
    var formData = new FormData();
    formData.append(buttonKey, document.getElementById("valueInput").value);
    var radioValue = "";
    var radios = document.getElementsByName('sortBy');
    for(var i=0; i<radios.length; i++) {
      if(radios[i].checked) {
        radioValue = radios[i].value;
      }
    }
    formData.append("sortBy", radioValue);
    var http = new XMLHttpRequest();
    http.open("POST", "http://localhost:3000/countries.php", true);
    http.send(formData);
    http.onreadystatechange = proccessRequest;
    //If there is an error sending the request, reconnect to the server
    http.onerror = function() { alert("Please connect to the server and try again."); }
    var DONE = 4;
    function proccessRequest(e) {
      if(http.status == 200 && http.readyState == DONE) {
        try {
          var resultsJson = JSON.parse(http.responseText);
        }
        catch(err) {
          //If an exception was caught, this means php isn't serving JSON
          //There must've been no results
          alert("No results found. Please try again with different search criteria.");
        }
        //If the user is searching by country name
        if(buttonKey == "value") {
          //Loop through the results, create elements for them, and append to page
          for(var i=0; i<resultsJson.length; i++) {
            var container = document.createElement("div");
            container.className = "countryContainer";
            document.getElementById("results").appendChild(container);
            var name = document.createElement("p");
            var aCode2 = document.createElement("p");
            var aCode3 = document.createElement("p");
            var region = document.createElement("p");
            var subregion = document.createElement("p");
            var population = document.createElement("p");
            var flag = document.createElement("img");
            var languages = document.createElement("p");
            name.innerHTML = "Name: " + resultsJson[i]["name"];
            aCode2.innerHTML = "Alpha 2 Code: " + resultsJson[i]["alpha2Code"];
            aCode3.innerHTML = "Alpha 3 Code: " + resultsJson[i]["alpha3Code"];
            region.innerHTML = "Region: " + resultsJson[i]["region"];
            subregion.innerHTML = "Subregion: " + resultsJson[i]["subregion"];
            population.innerHTML = "Population: " + resultsJson[i]["population"];
            var languagesString = "Languages: ";
            for(var x=0; x<resultsJson[i]["languages"].length; x++) {
              if(x != resultsJson[i]["languages"].length - 1) {
                languagesString = languagesString + resultsJson[i]["languages"][x]["name"] + ", ";
              }
              else {
                languagesString = languagesString + resultsJson[i]["languages"][x]["name"];
              }
            }
            languages.innerHTML = languagesString;
            flag.src = resultsJson[i]["flag"];
            container.appendChild(name);
            container.appendChild(aCode2);
            container.appendChild(aCode3);
            container.appendChild(region);
            container.appendChild(subregion);
            container.appendChild(population);
            container.appendChild(languages);
            container.appendChild(flag);
            var mybr = document.createElement('br');
            var mybr2 = document.createElement('br');
            container.parentNode.appendChild(mybr);
            container.parentNode.appendChild(mybr2);
          }
          //Create the variables at the bottom of the page for the totals
          var countriesTotal, regionsTotal, subregionsTotal;
          if(document.getElementById("countriesTotal") == null) {
            countriesTotal = document.createElement("p");
            countriesTotal.id = "countriesTotal";
            regionsTotal = document.createElement("p")
            regionsTotal.id = "regionsTotal";
            subregionsTotal = document.createElement("p");
            subregionsTotal.id = "subregionsTotal";
          }
          else {
            countriesTotal = document.getElementById("countriesTotal");
            regionsTotal = document.getElementById("regionsTotal")
            subregionsTotal = document.getElementById("subregionsTotal");
          }
          countriesTotal.innerHTML = "Total Countries: " + resultsJson.length;
          var regionsString = "Regions: ";
          var subregionsString = "Subregions: ";
          var regions = [];
          var subregions = [];
          for(var i=0; i<resultsJson.length; i++) {
            regions.push(resultsJson[i]["region"]);
            subregions.push(resultsJson[i]["subregion"]);
          }
          var regionsArrays = frequency(regions);
          var subregionsArrays = frequency(subregions);
          for(var i=0; i<regionsArrays[0].length; i++) {
            if(i != regionsArrays[0].length - 1) {
              regionsString = regionsString + regionsArrays[0][i] + " (" + regionsArrays[1][i] + " times), ";
            }
            else {
              regionsString = regionsString + regionsArrays[0][i] + " (" + regionsArrays[1][i] + " times)";
            }
          }
          for(var i=0; i<subregionsArrays[0].length; i++) {
            if(i != subregionsArrays[0].length - 1) {
              subregionsString = subregionsString + subregionsArrays[0][i] + " (" + subregionsArrays[1][i] + " times), ";
            }
            else {
              subregionsString = subregionsString + subregionsArrays[0][i] + " (" + subregionsArrays[1][i] + " times)";
            }
          }
          regionsTotal.innerHTML = regionsString;
          subregionsTotal.innerHTML = subregionsString;
          if(document.getElementById("countriesTotal") == null) {
            document.getElementById("bod").appendChild(countriesTotal);
            document.getElementById("bod").appendChild(regionsTotal);
            document.getElementById("bod").appendChild(subregionsTotal);
          }
        }
        //If the user is searching by country code
        else {
          //There is only one country found, so no need to loop
          var container = document.createElement("div");
          container.className = "countryContainer";
          document.getElementById("results").appendChild(container);
          var name = document.createElement("p");
          var aCode2 = document.createElement("p");
          var aCode3 = document.createElement("p");
          var region = document.createElement("p");
          var subregion = document.createElement("p");
          var population = document.createElement("p");
          var flag = document.createElement("img");
          var languages = document.createElement("p");
          name.innerHTML = "Name: " + resultsJson["name"];
          aCode2.innerHTML = "Alpha 2 Code: " + resultsJson["alpha2Code"];
          aCode3.innerHTML = "Alpha 3 Code: " + resultsJson["alpha3Code"];
          region.innerHTML = "Region: " + resultsJson["region"];
          subregion.innerHTML = "Subregion: " + resultsJson["subregion"];
          population.innerHTML = "Population: " + resultsJson["population"];
          var languagesString = "Languages: ";
          for(var x=0; x<resultsJson["languages"].length; x++) {
            if(x != resultsJson["languages"].length - 1) {
              languagesString = languagesString + resultsJson["languages"][x]["name"] + ", ";
            }
            else {
              languagesString = languagesString + resultsJson["languages"][x]["name"];
            }
          }
          languages.innerHTML = languagesString;
          flag.src = resultsJson["flag"];
          container.appendChild(name);
          container.appendChild(aCode2);
          container.appendChild(aCode3);
          container.appendChild(region);
          container.appendChild(subregion);
          container.appendChild(population);
          container.appendChild(languages);
          container.appendChild(flag);
          var mybr = document.createElement('br');
          var mybr2 = document.createElement('br');
          container.parentNode.appendChild(mybr);
          container.parentNode.appendChild(mybr2);
          //Declare the variables
          var countriesTotal, regionsTotal, subregionsTotal;
          if(document.getElementById("countriesTotal") == null) {
            countriesTotal = document.createElement("p");
            countriesTotal.id = "countriesTotal";
            regionsTotal = document.createElement("p")
            regionsTotal.id = "regionsTotal";
            subregionsTotal = document.createElement("p");
            subregionsTotal.id = "subregionsTotal";
          }
          else {
            countriesTotal = document.getElementById("countriesTotal");
            regionsTotal = document.getElementById("regionsTotal")
            subregionsTotal = document.getElementById("subregionsTotal");
          }
          countriesTotal.innerHTML = "Total Countries: 1";
          var regionsString = "Regions: ";
          var subregionsString = "Subregions: ";
          var regions = [];
          var subregions = [];
          regions.push(resultsJson["region"]);
          subregions.push(resultsJson["subregion"]);
          var regionsArrays = frequency(regions);
          var subregionsArrays = frequency(subregions);
          for(var i=0; i<regionsArrays[0].length; i++) {
            if(i != regionsArrays[0].length - 1) {
              regionsString = regionsString + regionsArrays[0][i] + " (" + regionsArrays[1][i] + " times), ";
            }
            else {
              regionsString = regionsString + regionsArrays[0][i] + " (" + regionsArrays[1][i] + " times)";
            }
          }
          for(var i=0; i<subregionsArrays[0].length; i++) {
            if(i != subregionsArrays[0].length - 1) {
              subregionsString = subregionsString + subregionsArrays[0][i] + " (" + subregionsArrays[1][i] + " times), ";
            }
            else {
              subregionsString = subregionsString + subregionsArrays[0][i] + " (" + subregionsArrays[1][i] + " times)";
            }
          }
          regionsTotal.innerHTML = regionsString;
          subregionsTotal.innerHTML = subregionsString;
          if(document.getElementById("countriesTotal") == null) {
            document.getElementById("bod").appendChild(countriesTotal);
            document.getElementById("bod").appendChild(regionsTotal);
            document.getElementById("bod").appendChild(subregionsTotal);
          }
        }
      }
    }
  }
}
//Event listeners that make the right request for the situation
var submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', function(event) {
  makeRequest("value");
});
var submitButtonCode = document.getElementById('submitButtonCode');
submitButtonCode.addEventListener('click', function(event) {
  makeRequest("valueCode");
});

//Takes and array as an input and returns two arrays
//The first array is each unique element present
//The second array is the number of times each unique element appear
function frequency(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}
