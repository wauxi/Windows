// DOM elements
const elements = {
  VIDEO_OUTPUT: document.getElementById("crtOutput"),
  OSD: document.getElementById("osd"),
  OSD_INPUT: document.getElementById("osdInput"),
  OSD_INPUT_3: document.getElementById("osdInput3"),
  OSD_INPUT_4: document.getElementById("osdInput4"),
  STATIC: document.getElementById("static"),
  POWER_SWITCH: document.getElementById("powerSwitch"),
  VHS_LED: document.getElementById("vhsLED"),
  VHS_FILTER: document.getElementById("vhsFilter"),
  VHS_FILTER_2: document.getElementById("vhsFilter2"),
  ZOOM_BUTTON: document.getElementById("zoomButton"),
  vhsButton: document.getElementById("vhsMode"),
  RESET_BUTTON: document.getElementById("reset"),
  NOISE_BUTTON: document.getElementById("noiseMode"),
  WHINE_BUTTON: document.getElementById("whineMode"),
  FLICKER_BUTTON: document.getElementById("flickerMode"),
  FLICKER_IMG: document.getElementById("flickering"),
  PLAY_LINK_BUTTON: document.getElementById("avInput"),
  FILE_INPUT: document.getElementById("fileInput"),
  FILE_UPLOAD_BUTTON: document.getElementById("fileUpload"),
  BACKGROUND_BUTTON: document.getElementById("backgroundChanger"),
  SUGGESTIONS_BUTTON: document.getElementById("suggestions"),
  STICKERS_BUTTON: document.getElementById("stickersButton"),
  INSTRUCTIONS_BUTTON: document.getElementById("instructions"),
};



let tvOff = true;
let s = 100,
  c = 120,
  b = 100,
  f = 0.5;
let vhsSettings = "sepia(0) grayscale(0) hue-rotate(5deg)";
let hideTimeoutId, timerInterval;
let vhsMode = false,
  rfNoise = false,
  crtWhineOn = false,
  crtFlicker = false;
let hours = 0,
  minutes = 0,
  seconds = 0;

// Helper functions
const resetTimer = () => {
  hours = 0;
  minutes = 0;
  seconds = 0;
};
const updateSettings = () => {
  elements.VIDEO_OUTPUT.style.filter = `saturate(${s}%) contrast(${c}%) brightness(${b}%) blur(${f}px) ${vhsSettings}`;
};
updateSettings();

const showOSDInput = () => {
  elements.OSD_INPUT.style.display = "block";
  clearTimeout(hideTimeoutId);
  hideTimeoutId = setTimeout(() => {
    elements.OSD_INPUT.style.display = "none";
  }, 3000);
};

const showOSD = () => {
  const blurDisplay = f.toFixed(1); // Round 'f' to 2 decimal places
  elements.OSD.innerText = `Saturation: ${s} Contrast: ${c} Brightness: ${b} Blur: ${blurDisplay}`;
  if (!tvOff) {
    elements.OSD.style.display = "block";
    clearTimeout(hideTimeoutId);
    hideTimeoutId = setTimeout(() => {
      elements.OSD.style.display = "none";
    }, 2000);
  }
};

const updateTimerDisplay = () => {
  elements.OSD_INPUT_4.textContent = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (++seconds === 60) {
      seconds = 0;
      if (++minutes === 60) {
        minutes = 0;
        hours++;
      }
    }
    updateTimerDisplay();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

const togglePower = () => {
  if (elements.VIDEO_OUTPUT.style.display === "block") {
    tvOff = true;
    elements.STATIC.style.opacity = "1";
    elements.STATIC.style.pointerEvents = "auto";
    elements.VIDEO_OUTPUT.style.display = "none";
    elements.VIDEO_OUTPUT.src = "";
    elements.OSD.style.display = "none";
    elements.OSD_INPUT.style.display = "none";
    elements.OSD_INPUT_3.style.display = "none";
    elements.OSD_INPUT_4.style.display = "none";
  } else {
    tvOff = false;
    showOSDInput();
    elements.STATIC.style.pointerEvents = "none";
    elements.VIDEO_OUTPUT.style.display = "block";
    elements.VIDEO_OUTPUT.src =
      "https://www.youtube-nocookie.com/embed/videoseries?list=PLWGfzR2YlaPhTW_M0lAnglK77UE03ZfWr&autoplay=1";
    elements.STATIC.style.opacity = rfNoise ? "0.05" : "0";
    if (vhsMode) {
      resetTimer();
      elements.OSD_INPUT_3.style.display = "block";
      elements.OSD_INPUT_4.style.display = "block";
    }
  }
};

// Zoom Button
let zoomed_in = false;

elements.ZOOM_BUTTON.addEventListener("click", () => {
  if (zoomed_in == false) {
    elements.VIDEO_OUTPUT.style.transform = "scale(1.4)";
    zoomed_in = true;
  } else {
    elements.VIDEO_OUTPUT.style.transform = "scale(1)";
    zoomed_in = false;
  }
});

const toggleVHSMode = () => {
  vhsMode = true;
  if (elements.VHS_FILTER.style.visibility === "visible") {
    elements.VHS_FILTER.style.visibility = "hidden";
    elements.VHS_FILTER_2.style.visibility = "hidden";
    s = 100;
    c = 120;
    b = 100;
    f = 0.5;
    vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
    updateSettings();
    elements.OSD_INPUT_3.style.display = "none";
    elements.OSD_INPUT_4.style.display = "none";
    stopTimer();
    resetTimer();
    vhsMode = false;
    elements.VHS_LED.style.background = "black";
    elements.VHS_LED.style.boxShadow = "none";
  } else {
    s = 100;
    c = 100;
    b = 110;
    f = 1.5;
    vhsSettings = "sepia(0.1) grayscale(0.1) hue-rotate(13deg)";
    updateSettings();
    elements.VHS_FILTER.style.visibility = "visible";
    elements.VHS_FILTER_2.style.visibility = "visible";
    if (!tvOff) {
      elements.OSD_INPUT_3.style.display = "flex";
      elements.OSD_INPUT_4.style.display = "block";
    }
    startTimer();
    elements.VHS_LED.style.background = "#fbff00";
    elements.VHS_LED.style.boxShadow = "1px 1px 20px 1px #fbff00";
  }
};

const setControlListeners = (control, condition, max) => {
  document.getElementById(control).addEventListener("click", () => {
    condition();
    updateSettings();
    showOSD();
  });
};

// Event listeners
elements.POWER_SWITCH.addEventListener("click", togglePower);

const controlConditions = {
  saturationUp: () => {
    if (s < 200) s += 10;
  },
  contrastUp: () => {
    if (c < 200) c += 10;
  },
  brightnessUp: () => {
    if (b < 200) b += 10;
  },
  blurUp: () => {
    if (f < 2) f += 0.1;
  },
  saturationDown: () => {
    if (s > 0) s -= 10;
  },
  contrastDown: () => {
    if (c > 0) c -= 10;
  },
  brightnessDown: () => {
    if (b > 0) b -= 10;
  },
  blurDown: () => {
    if (f > 0.1) f -= 0.1;
  },
};

Object.keys(controlConditions).forEach((control) =>
  setControlListeners(control, controlConditions[control])
);

elements.vhsButton.addEventListener("click", () => {
  if (!vhsMode) {
  } else {
  }
  toggleVHSMode();
});

elements.RESET_BUTTON.addEventListener("click", () => {
  s = vhsMode ? 100 : 100;
  c = vhsMode ? 100 : 120;
  b = vhsMode ? 110 : 100;
  f = vhsMode ? 1.5 : 0.5;
  updateSettings();
  showOSD();
});

elements.NOISE_BUTTON.addEventListener("click", () => {
  if (!tvOff) {
    rfNoise = !rfNoise;
    elements.STATIC.style.opacity = rfNoise ? "0.05" : "0";
  }
});

elements.WHINE_BUTTON.addEventListener("click", () => {
  crtWhineOn = !crtWhineOn;
});

let flicker_active = false;
let flicker_warning = false;

elements.FLICKER_BUTTON.addEventListener("click", () => {
  if (flicker_warning == false) {
    if (flicker_active == false) {
      if (confirm("Enable CRT Flickering ? (Warning: Flashing Lights)")) {
        elements.FLICKER_IMG.style.display = "block";
        flicker_active = true;
        flicker_warning = true;
      }
    }
  } else {
    if (flicker_active == false) {
      elements.FLICKER_IMG.style.display = "block";
      flicker_active = true;
    } else {
      elements.FLICKER_IMG.style.display = "none";
      flicker_active = false;
    }
  }
});

const commonPlaySetup = () => {
  elements.OSD_INPUT.style.display = "block";
  showOSDInput();
  elements.STATIC.style.pointerEvents = "none";
  elements.STATIC.style.opacity = "0";
  elements.VIDEO_OUTPUT.style.display = "block";
  tvOff = false;
  if (rfNoise) {
    elements.STATIC.style.opacity = "0.05";
  }
  if (vhsMode) {
    resetTimer();
    elements.OSD_INPUT_3.style.display = "block";
    elements.OSD_INPUT_4.style.display = "block";
  }
};

// Convert YouTube URLs
const getEmbeddedYouTubeURL = (url) => {
  const videoRegExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/;
  const playlistRegExp =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([\w\-]+)/;

  const videoMatch = url.match(videoRegExp);
  if (videoMatch && videoMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${videoMatch[1]}?autoplay=1`;
  }

  const playlistMatch = url.match(playlistRegExp);
  if (playlistMatch && playlistMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistMatch[1]}&autoplay=1`;
  }

  return url; // Return original if not a recognized YouTube link
};

elements.PLAY_LINK_BUTTON.addEventListener("click", () => {
  const inputUrl = document.getElementById("crtInput").value.trim();
  elements.VIDEO_OUTPUT.src = getEmbeddedYouTubeURL(inputUrl);
  commonPlaySetup();
  elements.VHS_FILTER.style.visibility = "hidden";
  elements.VHS_FILTER_2.style.visibility = "hidden";
  elements.VHS_LED.style.background = "black";
  elements.VHS_LED.style.boxShadow = "none";
  elements.OSD_INPUT_3.style.display = "none";
  elements.OSD_INPUT_4.style.display = "none";
  s = 100;
  c = 120;
  b = 100;
  f = 0.5;
  vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
  updateSettings();
  stopTimer();
  resetTimer();
  vhsMode = false;
  tvOff = false;
});

elements.INSTRUCTIONS_BUTTON.addEventListener("click", () => {
  alert(
    "You can embed YouTube videos by pasting the URL into the input field." +
      "\n" +
      "\n" +
      "You an also embed any HTML5 game, media, or website that allows being embedded." +
      "\n" +
      "\n" +
      "You can play with the picture settings by pressing the buttons under the screen, hover your mouse on each button to see a description of what they do." +
      "\n" +
      "\n" +
      "Here is the source code if you want to see how it works: https://github.com/the-daniele/sony-crt-tv" +
      "\n" +
      "\n" +
      "please do not re-publish on your own website unless you make it look different (like a different tv model for example) and if so, please credit me." +
      "\n" +
      "\n" +
      "You can contact me at daniele63web@hotmail.com for any inquiries or questions."
  );
});

elements.FILE_UPLOAD_BUTTON.addEventListener("click", () => {
  const file = elements.FILE_INPUT.files[0];
  if (file && file.type.startsWith("video/")) {
    elements.VIDEO_OUTPUT.src = URL.createObjectURL(file);
    commonPlaySetup();
    elements.VHS_FILTER.style.visibility = "hidden";
    elements.VHS_FILTER_2.style.visibility = "hidden";
    elements.VHS_LED.style.background = "black";
    elements.VHS_LED.style.boxShadow = "none";
    elements.OSD_INPUT_3.style.display = "none";
    elements.OSD_INPUT_4.style.display = "none";
    s = 100;
    c = 120;
    b = 100;
    f = 0.5;
    vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
    updateSettings();
    stopTimer();
    resetTimer();
    vhsMode = false;
    tvOff = false;
  } else {
    alert(
      file
        ? "Please select a video file."
        : "Please select a file before uploading."
    );
  }
});

elements.SUGGESTIONS_BUTTON.addEventListener("click", () => {
  alert(
    "Here's some cool stuff you can embed by pasting the URLs in the input field and pressing the embed button." +
      "\n" +
      "\n" +
      "Windows 7:" +
      "\n" +
      "https://win7simu.visnalize.com/" +
      "\n" +
      "\n" +
      "Windows 98:" +
      "\n" +
      "https://98.js.org/" +
      "\n" +
      "\n" +
      "Windows XP:" +
      "\n" +
      "https://xp.quenq.com/" +
      "\n" +
      "\n" +
      "Mario Bros:" +
      "\n" +
      "https://jcw87.github.io/c2-smb1/" +
      "\n" +
      "\n" +
      "Yume 2kki:" +
      "\n" +
      "https://ynoproject.net/2kki/" +
      "\n" +
      "\n" +
      "K-ON! Anime:" +
      "\n" +
      "https://archive.org/embed/k-on-animax-dub"
  );
});

// Stickers Button
let stickers_on = false;

if (elements.STICKERS_BUTTON) {
  elements.STICKERS_BUTTON.addEventListener("click", () => {
    if (stickers_on) {
      document.querySelectorAll(".stickers").forEach((element) => {
        element.style.display = "none";
      });
      stickers_on = false;
    } else {
      document.querySelectorAll(".stickers").forEach((element) => {
        element.style.display = "block";
      });
      stickers_on = true;
    }
  });
}

// Function to allow the user to upload a custom wallpaper
let wallpaper_changed = false;

function chooseWallpaper() {
  if (wallpaper_changed == false) {
    // Custom option: Allow the user to upload an image
    const input = document.createElement("input");
    input.type = "file";
    // Only allow image files
    input.accept = "image/*";

    input.addEventListener("change", function () {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const imageUrl = event.target.result;
          // Set the custom wallpaper
          document.body.style.background = `url('${imageUrl}') no-repeat center center fixed`;
          document.body.style.backgroundSize = "cover";
          document.body.style.mozBackgroundSize = "cover";
          document.body.style.oBackgroundSize = "cover";
        };
        reader.readAsDataURL(file); // Read the file as a data URL
        wallpaper_changed = true;
      }
    });

    // Trigger the file input to open the file chooser
    input.click();
  } else {
    document.body.style.background = `url("/televisions/images/background.jpg") no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
    document.body.style.mozBackgroundSize = "cover";
    document.body.style.oBackgroundSize = "cover";
    wallpaper_changed = false;
  }
}

// Ask user for wallpaper when the button is clicked
elements.BACKGROUND_BUTTON.addEventListener("click", chooseWallpaper);
