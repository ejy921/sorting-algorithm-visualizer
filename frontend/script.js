function dropdownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.drop-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
}

function chooseSizeFunction(button) {
    // Find the closest input-group and then the corresponding choosing size div
    const inputGroup = button.closest('.input-group');
    const hiddenDiv = inputGroup.querySelector('.choosing-size');

    // Toggle the display of the div
    if (hiddenDiv.style.display === "none" || hiddenDiv.style.display === "") {
        hiddenDiv.style.display = "block";
    } else {
        hiddenDiv.style.display = "none";
    }
}

function randomSizeFunction() {
    // Generate a random number between 2 and 20
    var randomNumber = Math.floor(Math.random() * (20 - 2 + 1)) + 2;

    var inputField = document.querySelector('input[name="array-size"]');
    inputField.value = randomNumber;

    var hiddenDiv = document.getElementById("chooseSize");
    if (hiddenDiv.style.display === "none" || hiddenDiv.style.display === "") {
        hiddenDiv.style.display = "block";
    }

    generateArray(randomNumber);
}

// Event listener for when user manually inputs size
document.addEventListener('input', function(event) {
    if (event.target.matches('input[name="array-size"]')) {
        var size = event.target.value;
        var inputGroup = event.target.closest('.input-group'); // Find the closest input group
        var arrayInput = inputGroup.querySelector('.array-input'); // Find the associated array input
        generateArray(size, arrayInput); // Pass the correct array input to generateArray
    }
});

function generateArray(size) {
    // console.log("generateArray called with size:", size);

    var arrayInput = document.querySelector('input[name="array"]');
    var newArray = [];
    for (var i = 1; i <= size; i++) {
        newArray.push(i);
    }

    var shuffledArray = shuffleArray(newArray);
    arrayInput.value = shuffledArray.join(", ");
    // console.log("Generated array in input box:", arrayInput.value);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

async function sortArrayFunction(sortType) {
    // Get array from input
    const checkedTab = document.querySelector(`input[name="tabs"]:checked`);

    console.log("Checked tab:", checkedTab.id); // Log the checked tab ID
    const index = Array.from(document.querySelectorAll(`input[name="tabs"]`)).indexOf(checkedTab);
    const tabElements = document.querySelectorAll('.tab');
    const tabElement = tabElements[index];

    const inputGroup = tabElement.querySelector('.input-group');
    const arrayInput = inputGroup.querySelector('#array-input').value;
    let array = arrayInput.split(',').map(Number);
    console.log(array);

    const hiddenImage = document.getElementById('animation-frame-bubble');
    const paragraph = inputGroup.nextElementSibling.querySelector('p');
    hiddenImage.style.display = 'block';
    paragraph.style.display = 'none';

    // Send array to backend
    const response = await fetch('http://127.0.0.1:5000/sort-array', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ array: array, algorithm: sortType }) // sending array + which algorithm
    })
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Log the raw response
    const rawText = await response.text();
    console.log("Raw response:", rawText);  // Log the raw response for debugging

    // Now try to parse it as JSON
    const result = JSON.parse(rawText);

    // Handle the result as before
    console.log("Sorted array:", result.sorted_array);
}

function startAnimation() {
    let currentFrame = 0;
    const imgElement = document.getElementById('animation-frame-${algorithm}');

    function updateFrame() {
        fetch('/frames/${currentFrame}')
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error("No more frames");
                }
            })
            .then(blob => {
                imgElement.src = URL.createObjectURL(blob);
                currentFrame++;
                setTimeout(updateFrame, 100);
            })
            .catch(error => console.error(error));
    }

    updateFrame();s
}

