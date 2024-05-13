// Array of available colors
const colors = ['#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80'];

// Get the color container div
const colorContainer = document.getElementById('colorContainer');

// Create color squares for each color
colors.forEach(color => {
    const div = document.createElement('div');
    div.className = 'colorSquare';
    div.style.backgroundColor = color;
    div.innerHTML = `<span class="colorCode">${color}</span>`;
    colorContainer.appendChild(div);
});

// Event listener for radio buttons
const schemeRadios = document.querySelectorAll('input[name="scheme"]');
schemeRadios.forEach(radio => {
    radio.addEventListener('change', applyColorScheme);
});

// Function to apply color scheme
function applyColorScheme() {
    const selectedColor = document.querySelector('.selected');
    const scheme = document.querySelector('input[name="scheme"]:checked').value;

    if (selectedColor) {
        const selectedColorCode = selectedColor.querySelector('.colorCode').textContent;
        const schemeColors = generateColorScheme(selectedColorCode, scheme);
        displayOutputColors(schemeColors);
    }
}

// Function to generate color scheme based on selected color and scheme type
function generateColorScheme(color, scheme) {
    switch (scheme) {
        case 'complementary':
            return generateComplementaryScheme(color);
        case 'triadic':
            return generateTriadicScheme(color);
        case 'compound':
            return generateCompoundScheme(color);
        case 'analogous':
            return generateAnalogousScheme(color);
        default:
            return [];
    }
}

// Function to generate complementary color scheme
function generateComplementaryScheme(color) {
    const complementaryColor = getComplementaryColor(color);
    return [color, complementaryColor];
}

// Function to get complementary color
function getComplementaryColor(color) {
    const rgb = hexToRgb(color);
    const invertedRgb = rgb.map(channel => 255 - channel);
    return rgbToHex(invertedRgb);
}

// Function to generate triadic color scheme
function generateTriadicScheme(color) {
    const triadicColor1 = shiftHue(color, 120);
    const triadicColor2 = shiftHue(color, 240);
    return [color, triadicColor1, triadicColor2];
}

// Function to generate compound (split complementary) color scheme
function generateCompoundScheme(color) {
    const complementaryColor = getComplementaryColor(color);
    const triadicColor = shiftHue(complementaryColor, 60);
    return [color, complementaryColor, triadicColor];
}

// Function to generate analogous color scheme
function generateAnalogousScheme(color) {
    const analogousColor1 = shiftHue(color, 30);
    const analogousColor2 = shiftHue(color, -30);
    return [analogousColor2, color, analogousColor1];
}

// Function to shift the hue of a color
function shiftHue(color, degrees) {
    const hslColor = rgbToHsl(hexToRgb(color));
    const hue = (hslColor[0] + degrees) % 360;
    return hslToHex([hue, hslColor[1], hslColor[2]]);
}

// Function to convert hex color to RGB
function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
}

// Function to convert RGB color to hex
function rgbToHex(rgb) {
    return '#' + rgb.map(channel => channel.toString(16).padStart(2, '0')).join('');
}

// Function to convert RGB color to HSL
function rgbToHsl(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// Function to convert HSL color to hex
function hslToHex(hsl) {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Function to display output colors
function displayOutputColors(colors) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = '';
    colors.forEach(color => {
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        span.textContent = color;
        outputContainer.appendChild(span);
    });
}

// Event listener for color squares
colorContainer.addEventListener('click', function(event) {
    const colorSquare = event.target.closest('.colorSquare');
    if (colorSquare) {
        const selectedColor = document.querySelector('.selected');
        if (selectedColor) {
            selectedColor.classList.remove('selected');
        }
        colorSquare.classList.add('selected');
        applyColorScheme();
    }
});

// Initial application of color scheme
applyColorScheme();