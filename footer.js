document.addEventListener("DOMContentLoaded", function() {
    // Create a new footer element
    var footer = document.createElement("footer");
    
    // Create a div element for the copyright text
    var copyrightDiv = document.createElement("div");
    copyrightDiv.classList.add("copyright");

    // Create a paragraph element for the copyright text
    var copyrightText = document.createElement("p");
    copyrightText.innerHTML = "&copy; 2024 Team 20 Semarang. All rights reserved.";

    // Append the paragraph element to the div
    copyrightDiv.appendChild(copyrightText);

    // Append the div to the footer element
    footer.appendChild(copyrightDiv);

    // Get the footer element by its id
    var footerContainer = document.getElementById("footer");

    // Append the footer element to the footer container
    footerContainer.appendChild(footer);
});
