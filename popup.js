let filters = {
    brightness: 100,
    warmth: 0,
    contrast: 100,
    textSize: 1,
};


const sliders = document.querySelectorAll('.slider-group input');

sliders.forEach(slider => {
    const valueDisplay = document.getElementById(`${slider.id}-value`);

    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: applySlider,
                args: [slider.id, slider.value]
            });
        });
    });
});



const updateTabStyles = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentFilters = { ...filters };

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (filters) => {
            document.body.style.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.warmth}%)`;
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (parseFloat(style.fontSize)) {
                    el.style.fontSize = `${filters.textSize}rem`;
                }
            });


        },
        args: [currentFilters],
    });
};


// Sliders
document.getElementById("brightness").addEventListener("input", e => {
    filters.brightness = e.target.value;
    updateTabStyles();
});
document.getElementById("warmth").addEventListener("input", e => {
    filters.warmth = e.target.value;
    updateTabStyles();
});
document.getElementById("contrast").addEventListener("input", e => {
    filters.contrast = e.target.value;
    updateTabStyles();
});
document.getElementById("text-size").addEventListener("input", e => {
    filters.textSize = e.target.value;
    updateTabStyles();
});


// Reset button
document.getElementById("reset").addEventListener("click", () => {
    filters = { brightness: 100, warmth: 0, contrast: 100, textSize: 1, font: "default", bgColor: "light" };
    updateTabStyles();
});

// Initialize
updateTabStyles();
