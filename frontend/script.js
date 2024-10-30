function dropdownFunction(myDropDownID) {
    document.getElementById(myDropDownID).classList.toggle("show");
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

    hiddenDiv.style.display = "block";
}

function randomSizeFunction(button) {
    // Generate a random number between 2 and 20
    var randomNumber = Math.floor(Math.random() * (20 - 2 + 1)) + 2;

    var inputGroup = button.closest('.input-group');
    var inputField = inputGroup.querySelector('input[name="array-size"]');
    inputField.value = randomNumber;
    var hiddenDiv = inputGroup.querySelector('.choosing-size');
    
    hiddenDiv.style.display = "block";

    generateArray(randomNumber);
}

// Event listener for when user manually inputs size
document.addEventListener('input', function(event) {
    if (event.target.matches('input[name="array-size"]')) {
        var size = event.target.value;
        var inputGroup = event.target.closest('.input-group');
        var arrayInput = inputGroup.querySelector('.array-input');
        generateArray(size, arrayInput);
    }
});

function generateArray(size) {
    var checkedTab = document.querySelector('input[name="tabs"]:checked');
    const index = Array.from(document.querySelectorAll('input[name="tabs"]')).indexOf(checkedTab);
    var tabElements = document.querySelectorAll('.tab');
    var tabElement = tabElements[index];
    var inputGroup = tabElement.querySelector('.input-group');
    var arrayInput = inputGroup.querySelector('#array-input'); 
    
    var newArray = [];
    for (var i = 1; i <= size; i++) {
        newArray.push(Math.floor(Math.random() * 100));
    }

    var shuffledArray = shuffleArray(newArray);
    arrayInput.value = shuffledArray.join(", "); 
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}


async function updateFrame() {
    const response = await fetch(`/frames/${currentFrame}`);
    
    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        animationFrameImage.src = url; // Update the image source to the new frame
        hiddenImage.style.display = "block"; // Show the image
        currentFrame++;

        // Stop the animation when all frames have been shown
        if (currentFrame >= totalFrames) {
            clearInterval(frameInterval); // Stop the interval
            currentFrame = 0; // Reset frame index if you want to restart the animation later
            hiddenImage.style.display = "none"; // Hide the image after animation
        }
    } else {
        console.error("No more frames or an error occurred");
        hiddenImage.style.display = "none"; // Hide the image if there's an error
        clearInterval(frameInterval); // Stop the interval
    }
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

    const hiddenImage = document.getElementById(`animation-frame-${sortType}`);
    const paragraph = hiddenImage.closest('.animation-container').querySelector('p');
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
    if (response.ok) {
        const data = await response.json();
        console.log("Response data: ", data); // Log the response data
        console.log("Frame URLs: ", data.frame_urls);
        
        // Preload images
        await preloadImages(data.frame_urls); // Ensure images are preloaded

        // Display frames in sequence
        for (let i = 0; i < data.frame_urls.length; i++) {
            // Set the source of the image to the current frame
            hiddenImage.src = data.frame_urls[i];
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 0.5 seconds before showing the next frame
        }

    } else {
        console.error("Error sending array to Python:", response.statusText);
    }

    // Log the raw response
    // const rawText = await response.text();
    // console.log("Raw response:", rawText);  // Log the raw response for debugging

    // Now try to parse it as JSON
    const result = JSON.parse(rawText);

    // Handle the result as before
    console.log("Sorted array:", result.sorted_array);
}

async function preloadImages(frameUrls) {
    console.log("Preloading images...");
    const promises = frameUrls.map(url => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                console.log(`Image preloaded: ${url}`);
                resolve(); // Resolve when the image is loaded
            };
            img.onerror = () => {
                console.error(`Error preloading image: ${url}`);
                resolve(); // Resolve on error to not block the rest
            };
        });
    });
    await Promise.all(promises); // Wait until all images are preloaded
    console.log("All images preloaded.");
}

