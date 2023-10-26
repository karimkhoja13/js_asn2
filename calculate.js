// This file contains the logic to read the input file, calculate the histogram and statistics, and update the output section

var input = document.getElementById("file-input");
var data = [];
input.addEventListener ("change", function () { 
  var file = input.files[0];
  // Check if the file is a CSV file
  if (file.type !== "text/csv") {
    displayError("Invalid input file. Please select a valid CSV file.");
    // clearOutput();
    return;
  }
  // Create a file reader object
  var reader = new FileReader();
  // Define a callback function for when the file is loaded
  reader.onload = function(e) {
    // Get the file content as a string
    var content = e.target.result;
    // Split the content by line breaks
    var lines = content.split("\n");
    // Create an empty array to store the parsed data
    
    var outOfBounds = [];
    // Loop through each line
    for (var i = 1; i < lines.length; i++) {

      // Split the line by commas
      var fields = lines[i].split(",");
      // Check if the line has two fields
      if (fields.length === 2) {
        // Get the name and grade from the fields
        var name = fields[0].trim();
        var grade = parseFloat(fields[1].trim());

        // var slicedGrade = (fields[1].trim()).slice(0, -1);
        // var grade = parseFloat(slicedGrade);
        // console.log(name + " " + grade.toString);

        console.log(name + " " + grade.toString());

        // Check if the grade is a valid number between 0 and 100
        if (!isNaN(grade) && grade >= parseFloat(document.getElementById("f").value) && grade <= parseFloat(document.getElementById("maximum-grade").value)) { // 100 will be changed to max later
          // Create an object with name and grade properties and push it to the data array
          data.push({name, grade});
        } else {
          // Display an error message and clear the output section
          outOfBounds.push({name, grade})
        }
      } else {
        // Display an error message and clear the output section
        displayError("Invalid input format. Please use comma-separated values.");
        clearOutput();
      }
    }
    console.log("Length of data[] is " + data.length); // FOR TESTING

    // If the data array is not empty, update the histogram and statistics with the data
    if (data.length > 0) {
      updateHistogram();
      updateStats(data);
    } else {
      // Display an error message and clear the output section
      displayError("No data found. Please select a non-empty file.");
      clearOutput();
      return;
    }
  };
  // Read the file as a text
  reader.readAsText(file);
});

// This function reads the input file and parses it into an array of objects with name and grade properties
function readFile(fileInput) {
  // Get the file object from the file input element
  
}

// This function updates the histogram with the given data array
function updateHistogram() {
  // Get the lower bounds of letter grades from the input elements
  var maxGrade = parseFloat(document.getElementById("maximum-grade").value);
  var aPlus = parseFloat(document.getElementById("a-plus").value);
  var a = parseFloat(document.getElementById("a").value);
  var aMinus = parseFloat(document.getElementById("a-minus").value);
  var bPlus = parseFloat(document.getElementById("b-plus").value);
  var b = parseFloat(document.getElementById("b").value);
  var bMinus = parseFloat(document.getElementById("b-minus").value);
  var cPlus = parseFloat(document.getElementById("c-plus").value);
  var c = parseFloat(document.getElementById("c").value);
  var cMinus = parseFloat(document.getElementById("c-minus").value);
  var d = parseFloat(document.getElementById("d").value);
  var f = parseFloat(document.getElementById("f").value);

  // Check if all the lower bounds are valid numbers between 0 and 100
  if (isNaN(maxGrade) || isNaN(aPlus) || isNaN(a) || isNaN(aMinus) || isNaN(bPlus) || isNaN(b) || isNaN(bMinus) || isNaN(cPlus) || isNaN(c) || isNaN(cMinus) ||isNaN(d) || isNaN(f)) {
    // Display an error message and clear the output section
    displayError("Invalid grade bounds. Please enter numbers between 0 and 100.");
    // clearOutput();
    return;
  }

  // Check if all the lower bounds are in descending order
  if (maxGrade < aPlus || aPlus < a || a < aMinus || aMinus < bPlus || bPlus < b || b < bMinus || bMinus < cPlus || cPlus < c || c < cMinus) {
    // Display an error message and clear the output section
    displayError("Invalid grade bounds. Please enter numbers in descending order.");
    // clearOutput();
    return;
  } else {
    clearOutput();
  }

  // Create an object to store the counts of students in each letter grade range
  var counts = {
    Max: 0,
    Aplus: 0,
    A: 0,
    Aminus: 0,
    Bplus: 0,
    B: 0,
    Bminus: 0,
    Cplus: 0,
    C: 0,
    Cminus: 0,
    D: 0,
    F: 0
  };

  // Loop through each student in the data array
  for (var i = 0; i < data.length; i++) {
    // Get the grade of the student
    var grade = data[i].grade;
    // Increment the corresponding count in the counts object based on the grade and the lower bounds
    if (grade > maxGrade) {
      counts.Max++;
    } else if (grade >= aPlus) {
      counts.Aplus++;
    } else if (grade >= a) {
      counts.A++;
    } else if (grade >= aMinus) {
      counts.Aminus++;
    } else if (grade >= bPlus) {
      counts.Bplus++;
    } else if (grade >= b) {
      counts.B++;
    } else if (grade >= bMinus) {
      counts.Bminus++;
    } else if (grade >= cPlus) {
      counts.Cplus++;
    } else if (grade >= c) {
      counts.C++;
    } else if (grade >= cMinus) {
      counts.Cminus++;
    } else if (grade >= 50) {
      counts.D++;
    } else {
      counts.F++;
    }
  }

  // Get the histogram div element
  var histogram = document.querySelector("#histogram");
  // Clear the histogram div content
  histogram.innerHTML = "";
  // Loop through each letter grade in the counts object
  for (var letter in counts) {
    // Get the count of students in that letter grade range
    var count = counts[letter];
    // If the count is not zero, create a bar element and append it to the histogram div
    if (count > 0) {
      // Create a div element with the class "bar" and a specific class for the letter grade
      var row = histogram.insertRow(-1);
      var cell1 = row.insertCell(-1); // -1 means the last position
      var cell2 = row.insertCell(-1); // -1 means the last position
      cell2.style.width = "200px";
      var label = document.createElement("p");
      var bar = document.createElement("div");
      bar.className = "bar " + letter + "-bar";
      // Calculate the width of the bar as a percentage of the total number of students
      var width = Math.round(count / data.length * 100) * 3;
      // Set the style attribute of the bar element with the width value
      bar.style.width = width + "%";
      // Set the data attribute of the bar element with the count value
      bar.setAttribute("data-count", count);
      // Set the text content of the bar element with the letter grade and the count value
      label.textContent = letter + " (" + count + ")";
      // Append the bar element to the histogram div
      cell1.appendChild(label);
      cell2.appendChild(bar);
    }
  }
}

// This function updates the statistics with the given data array
function updateStats(data) {
  // Get the stats div element
  var stats = document.getElementById("stats");
  // Clear the stats div content
  stats.innerHTML = "";
  // Create an array to store the grades of all students
  var grades = [];
  // Loop through each student in the data array
  for (var i = 0; i < data.length; i++) {
    // Get the grade of the student and push it to the grades array
    var grade = data[i].grade;
    grades.push(grade);
  }
  // Sort the grades array in ascending order
  grades.sort(function(a, b) {return a - b;});
  // Calculate the highest grade as the last element of the grades array
  var highest = grades[grades.length - 1];
  // Calculate the lowest grade as the first element of the grades array
  var lowest = grades[0];
  // Calculate the mean grade as the sum of all grades divided by the number of students
  var sum = grades.reduce(function(a, b) {return a + b;}, 0);
  var mean = sum / data.length;
  // Calculate the median grade as the middle element of the grades array if it has an odd length, or the average of the middle two elements if it has an even length
  var median;
  if (grades.length % 2 === 1) {
    median = grades[Math.floor(grades.length / 2)];
  } else {
    median = (grades[grades.length / 2 - 1] + grades[grades.length / 2]) / 2;
  }
}



// This function displays an error message in the output section
function displayError(message) {
  // Get the histogram div element
  var histogram = document.getElementById("histogram");
  // Clear the histogram div content
  histogram.innerHTML = "";
  // Create a paragraph element with the class "error"
  var error = document.createElement("p");
  error.className = "error";
  // Set the text content of the paragraph element as the message
  error.textContent = message;
  // Append the paragraph element to the histogram div
  histogram.appendChild(error);
  var stats = document.getElementById("stats");
  stats.innerHTML = "";
}

function clearOutput() {
  // Get the histogram div element
  var histogram = document.getElementById("histogram");
  // Clear the histogram div content
  histogram.innerHTML = "";
  // Get the stats div element
  var stats = document.getElementById("stats");
  stats.innerHTML = "";
}