//constructing the radial menu for base interactions
var radialMenu = document.createElement("div");
radialMenu.classList.add("radialMenu");

//was placeholder, sort of load bearing for the state of the radial
var testbutton = document.createElement("input");
testbutton.type = "checkbox";
radialMenu.appendChild(testbutton);

//note, cassette, dvd, pen tool, pins
var makeNote = document.createElement("button");
makeNote.textContent = "text";
var makeAudio = document.createElement("button");
makeAudio.textContent = "A/V";
var makeVisual = document.createElement("button");
makeVisual.textContent = "silent imgs";
var makeDraw = document.createElement("button");
makeDraw.textContent = "pen";
var makePin = document.createElement("button");
makePin.textContent = "pin";
var closeMake = document.createElement("button");
closeMake.textContent = "x";
closeMake.style.height = "40px";
closeMake.style.width = "40px";
// closeMake.addEventListener("click", function () {
//   testbutton.checked = false;
// });
// group operations here, make any option close the radial
var buttons = [makeNote, makeAudio, makeVisual, makeDraw, makePin, closeMake];
buttons.forEach(function (button) {
  button.setAttribute("disabled", "disabled");
  button.addEventListener("click", function () {
    testbutton.checked = false;
    // document.removeChild(radialMenu); //doesn't work
    // keeping this option here in case we want to fly away the vanish based on where it was clicked
    document.removeChild(radialMenu);
    buttons.forEach(function (button) {
      button.setAttribute("disabled", "disabled");
      // enable this again or set timeout on button
      // button.style.top = (-45).toString() + "px";
      // button.style.left = (-45).toString() + "px";
    });
  });

  radialMenu.appendChild(button);
});

//zindex reference
var zincrement = 0;

// function for dragging full notes
function setDraggable(elem) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elem.onmousedown = dragMouseDown;

  function dragMouseDown(ev) {
    if (elem == ev.target && ev.buttons == 1) {
      ev.preventDefault();
      pos3 = ev.clientX;
      pos4 = ev.clientY;
      document.onmouseup = stopDragging;
      // call a function whenever the cursor moves:
      document.onmousemove = dragItem;
    }
  }

  function dragItem(ev) {
    ev.preventDefault();
    if (zincrement < document.querySelectorAll(".note").length) {
      zincrement = document.querySelectorAll(".note").length;
    }
    document.querySelectorAll(".pinned").forEach(function (extantPinned) {
      extantPinned.style.zIndex = (zincrement + 2).toString();
    });
    if (!elem.classList.contains("floored")) {
      elem.style.zIndex = (zincrement + 1).toString();
    }
    // calculate the new cursor position:
    pos1 = pos3 - ev.clientX;
    pos2 = pos4 - ev.clientY;
    pos3 = ev.clientX;
    pos4 = ev.clientY;
    // set the element's new position:
    elem.style.top = elem.offsetTop - pos2 + "px";
    elem.style.left = elem.offsetLeft - pos1 + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
    zincrement++; //this applies on every mouseup
  }
}
// setDraggable(document.body); // has issues with the create wheel eating the input

//function for resizing notes
function setResizeable(elem) {
  //note is freeform, cassette and visuals are fixed ratio
  //grab bloc and resize parent to it, steal from setDraggable
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elem.onmousedown = dragMouseDown;

  function dragMouseDown(ev) {
    if (elem == ev.target && ev.buttons == 1) {
      ev.preventDefault();
      pos3 = ev.clientX;
      pos4 = ev.clientY;
      document.onmouseup = stopDragging;
      // call a function whenever the cursor moves:
      document.onmousemove = dragItem;
    }
  }
  function dragItem(ev) {
    ev.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - ev.clientX;
    pos2 = pos4 - ev.clientY;
    pos3 = ev.clientX;
    pos4 = ev.clientY;
    // set the element's parent div to the right dimensions:
    // this part SUCKS i DONT understand why we can't just pull the parent height but APPARENTLY THAT DOESNT EXIST??

    if (elem.parentElement.classList.contains("polaroid")) {
      elem.parentElement.style.height =
        (
          elem.parentElement.getBoundingClientRect()["height"] -
          // fix this later, the notes are being handled differently
          // discs are broken rn as well
          // elem.parentElement.style.paddingBottom - // does not read this fsr
          pos2
        ).toString() + "px";
      elem.parentElement.style.width =
        (
          elem.previousSibling.getBoundingClientRect()["width"] + 20
        ).toString() + "px";
      //compensate with width
      elem.previousSibling.style.height =
        (elem.parentElement.getBoundingClientRect()["height"] - 50).toString() +
        "px";
      //add in the resize for the input field here, ?
      elem.nextSibling.style.width =
        (elem.previousSibling.getBoundingClientRect()["width"] + 20).toString +
        "px";
    } else {
      elem.parentElement.style.height =
        (
          elem.parentElement.getBoundingClientRect()["height"] -
          (elem.parentElement.classList.contains("note") ? 20 : 0) -
          // fix this later, the notes are being handled differently
          // discs are broken rn as well
          // elem.parentElement.style.paddingBottom - // does not read this fsr
          pos2
        ).toString() + "px";
      elem.parentElement.style.width =
        (
          elem.parentElement.getBoundingClientRect()["width"] - pos1
        ).toString() + "px";
    }
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// function for reordering paragraph elements that are set to draggable
function setReorderable(elem) {
  //stealing most of the stuff from the one above,
  // checking for relative position to siblings?
  // reorder live
}

// screen movement with unhandled arrow key input, wasd?

//function for new - this applies while tabbing through the buttons as well...
// may want to make them non interactable, or delete and remake (change how the eventhandler works? spawn them in each time? check how resource intensive that will be)
function lineBreak(ev, note) {
  if (ev.key == "Enter" && !ev.shiftKey) {
    //case for exiting the edit. don't delete the note, leave for later
    if (
      ev.target.textContent == "" &&
      ev.target.parentElement.childElementCount > 1
    ) {
      note.removeChild(ev.target);
    } else {
      // norm case
      ev.preventDefault();
      var newP = document.createElement("p");
      newP.classList.add("text");
      newP.contentEditable = true;
      newP.addEventListener("keydown", function (ev) {
        lineBreak(ev, note);
      });
      // note.appendChild(newP);
      note.insertBefore(newP, ev.target.nextSibling);
      newP.focus(); //{ preventScroll: true }
      // ev.stopPropogation();
    }
  } else if (ev.key == "ArrowUp" && ev.target.previousSibling != null) {
    // code for moving up a line
    ev.target.previousSibling.focus();
    // additional code for moving the line up?
    if (ev.altKey) {
      //conditional works
      var cur = ev.target,
        above = ev.target.previousSibling;
      cur.parentElement.replaceChild(cur, above);
      cur.parentElement.insertBefore(above, cur.nextSibling);
      cur.focus();
    }
  } else if (ev.key == "ArrowDown" && ev.target.nextSibling != null) {
    // repeat for down
    ev.target.nextSibling.focus();
    // and then again
    if (ev.altKey) {
      //conditional works
      var cur = ev.target,
        below = ev.target.nextSibling;
      cur.parentElement.replaceChild(cur, below);
      cur.parentElement.insertBefore(below, cur);
      cur.focus();
    }
  }
  // delete case, move to next
  else if (
    ev.key == "Delete" &&
    ev.target.textContent == "" &&
    ev.target.nextSibling != null
  ) {
    ev.preventDefault();
    ev.target.nextSibling.focus();
    note.removeChild(ev.target);
    // then set focus to next
  }
  //backspace case, move to prev
  else if (
    ev.key == "Backspace" &&
    ev.target.textContent == "" &&
    ev.target.previousSibling != null &&
    ev.target.parentElement.childElementCount > 2
  ) {
    // then set focus to prev
    ev.preventDefault();
    ev.target.previousSibling.focus();
    note.removeChild(ev.target);
  }
}

//menu elements for reuse ; can't rly externalize without extra jank about referencing the nodes they're targeting so
// var menuPinTop = new nw.MenuItem({
//   label: "pin to top",
//   click: function (ev) {
//     ev.target.classList.add("pinned");
//     ev.target.classList.remove("floored");
//     ev.target.style.zIndex = (zincrement + 2).toString();
//     menuPinBot.label = "unpin from top";
//     menuPinTop.click = function () {
//       note.classList.remove("pinned");
//     };
//   },
// });
// var menuPinBot = new nw.MenuItem({
//   label: "pin to bottom",
//   click: function (ev) {
//     ev.target.classList.add("floored");
//     ev.target.classList.remove("pinned");
//     ev.target.style.zIndex = (zincrement * 0).toString();
//   },
// });
//submenu for the color options
// var menuSubmenuColors = new nw.Menu();
// colors
// var color1icon = Image(50, 50);
// color1icon.src = "../assets/puff.jpg";
// var color2icon = Image(50, 50);
// color2icon.src = "../assets/red.jpg";
// var color3icon = Image(50, 50);
// color3icon.src = "../assets/green.jpg";
// var color4icon = Image(50, 50);
// color4icon.src = "../assets/blue.jpg";

//independent operations, making elements
//text note, editable paragraphs inside div
//  start with 1 div 1 p, ret makes new blank, ret in blank clears and exits focus
makeNote.addEventListener("click", function (ev) {
  //make div, child p
  var note = document.createElement("div");
  note.classList.add("note"); //base class for notes specifically, not the other graphics
  // add the context menu for each text note. pin up, down, change colors, delete note
  var menu = new nw.Menu();
  var menuPinTop = new nw.MenuItem({
    label: "pin to top",
    click: function () {
      note.classList.add("pinned");
      note.classList.remove("floored");
      note.style.zIndex = (zincrement + 2).toString();
      menuPinTop.label = "unpin from top";
      menuPinTop.click = function () {
        note.classList.remove("pinned");
      };
    },
  });
  var menuPinBot = new nw.MenuItem({
    label: "pin to bottom",
    click: function () {
      note.classList.add("floored");
      note.classList.remove("pinned");
      note.style.zIndex = (zincrement * 0).toString();
      menuPinBot.label = "unpin from bot";
      menuPinBot.click = function () {
        note.classList.remove("floored");
      };
    },
  });
  var menuSubmenuColors = new nw.Menu();
  var menuSubmenuColorsHolder = nw.MenuItem({
    label: "set color:",
    submenu: menuSubmenuColors,
  });
  var submenuColor1 = new nw.MenuItem({
    label: "pale",
    // icon: "../assets/puff.jpg",
    click: function () {
      note.style.backgroundColor = "antiquewhite";
    },
  });
  var submenuColor2 = new nw.MenuItem({
    label: "blue",
    // icon: "../assets/blue.jpg",
    click: function () {
      note.style.backgroundColor = "#3998b4";
    },
  });
  var submenuColor3 = new nw.MenuItem({
    label: "red",
    // icon: "../assets/red.jpg",
    click: function () {
      note.style.backgroundColor = "#bc536d";
    },
  });
  var submenuColor4 = new nw.MenuItem({
    label: "green",
    // icon: "../assets/green.jpg",
    click: function () {
      note.style.backgroundColor = "#2da37a";
    },
  });
  menuSubmenuColors.append(submenuColor1);
  menuSubmenuColors.append(submenuColor2);
  menuSubmenuColors.append(submenuColor3);
  menuSubmenuColors.append(submenuColor4);
  // var menuCopyText = new nw.MenuItem({
  //   label: "copy text",
  //   click: function(){
  //     note.querySelectorAll("p").forEach(function(textblock){
  //       // need a package for this, clipboardy?
  //     })
  //   }
  // })
  // var menuCloneNote = new nw.MenuItem({ // this doesn't work out right bc it breaks movement
  //   label: "clone note",
  //   click: function () {
  //     document.body.appendChild(note.cloneNode(true));
  //   },
  // });
  var menuDeleteNote = new nw.MenuItem({
    label: "delete note",
    click: function () {
      if (confirm("delete? real?")) {
        document.body.removeChild(note);
      }
    },
  });
  menu.append(menuPinTop);
  menu.append(menuPinBot);
  menu.append(menuSubmenuColorsHolder);
  // menu.append(menuCopyText)
  // menu.append(menuCloneNote);
  menu.append(menuDeleteNote);
  note.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
    menu.popup(ev.x, ev.y);
  });
  var noteText = document.createElement("p");
  noteText.classList.add("text");
  noteText.contentEditable = true;
  // add the linebreak to the starting paragraph, recur inside
  noteText.addEventListener("keydown", function (ev) {
    lineBreak(ev, note);
  });
  //eventually we need to do voices, that prob goes here

  //resize grabbable
  noteHandle = document.createElement("div");
  noteHandle.classList.add("noteHandle");
  setResizeable(noteHandle);
  //place on board
  note.appendChild(noteHandle);
  note.appendChild(noteText);
  document.body.appendChild(note);
  noteText.focus();
  note.style.top = (ev.clientY + 85).toString() + "px";
  note.style.left = (ev.clientX - 20).toString() + "px";
  //attach drag script? or can we handle that glob
  setDraggable(note);
});

const reader = new FileReader();

makeAudio.addEventListener("click", async function (ev) {
  var pickerOpts = {
    types: [
      {
        description: "AudioVisual formats",
        accept: {
          "audio/*": [".mp3", ".wav", ".ogg"],
          "video/*": [".mp4", ".webm", ".ogg"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const fileData = await fileHandle.getFile();
  if (!fileData) {
    return;
  } else {
    if (fileData.type.startsWith("audio")) {
      // //this doesn't work fsr
      // console.log(fileData);
      // var sound = reader.readAsDataURL(file); //i THINK this works?
      var audioBlock = document.createElement("audio");
      audioBlock.controls = true;
      var source = document.createElement("source");
      source.src = URL.createObjectURL(fileData); //from how i understand this we need to load the dataurl and pass it as the audio source for the element but idk if that is this.
      source.type = fileData.type;
      // make div inside conditional bc classlist
      var note = document.createElement("div");
      note.classList.add("cassette");

      audioBlock.appendChild(source);
      note.appendChild(audioBlock);
      // console.log("success " + fileData.toString());
    } else if (fileData.type.startsWith("video")) {
      var source = document.createElement("source");
      var fileBlob = new Blob([fileData], { type: "video\/mp4" }); //doesn't change anything
      // var buf = await fileBlob.arrayBuffer();
      source.src = URL.createObjectURL(
        new Blob([fileData], { type: fileData.type }),
      );
      // source.src = fileData;
      // source.src = URL.createObjectURL(fileData);
      // source.src = new MediaStream();
      console.log(fileHandle);
      source.type = fileData.type;
      var note = document.createElement("div");
      note.classList.add("disc");

      var videoBlock = document.createElement("video");
      videoBlock.controls = true;

      videoBlock.appendChild(source);
      videoBlock.autoplay = false;
      note.appendChild(videoBlock);
    }
    // pin top, pin bottom, delete, change color, etc. need to edit the color settings
    var menu = new nw.Menu();
    var menuPinTop = new nw.MenuItem({
      label: "pin to top",
      click: function () {
        note.classList.add("pinned");
        note.classList.remove("floored");
        note.style.zIndex = (zincrement + 2).toString();
        menuPinTop.label = "unpin from top";
        menuPinTop.click = function () {
          note.classList.remove("pinned");
        };
      },
    });
    var menuPinBot = new nw.MenuItem({
      label: "pin to bottom",
      click: function () {
        note.classList.add("floored");
        note.classList.remove("pinned");
        note.style.zIndex = (zincrement * 0).toString();
        menuPinBot.label = "unpin from bot";
        menuPinBot.click = function () {
          note.classList.remove("floored");
        };
      },
    });
    var menuSubmenuColors = new nw.Menu();
    var menuSubmenuColorsHolder = nw.MenuItem({
      label: "set color:",
      submenu: menuSubmenuColors,
    });
    var submenuColor1 = new nw.MenuItem({
      label: "pale",
      click: function () {
        note.style.backgroundColor = "antiquewhite";
      },
    });
    var submenuColor2 = new nw.MenuItem({
      label: "blue",
      click: function () {
        note.style.backgroundColor = "#3998b4";
      },
    });
    var submenuColor3 = new nw.MenuItem({
      label: "red",
      click: function () {
        note.style.backgroundColor = "#bc536d";
      },
    });
    var submenuColor4 = new nw.MenuItem({
      label: "green",
      click: function () {
        note.style.backgroundColor = "#2da37a";
      },
    });
    menuSubmenuColors.append(submenuColor1);
    menuSubmenuColors.append(submenuColor2);
    menuSubmenuColors.append(submenuColor3);
    menuSubmenuColors.append(submenuColor4);
    // var menuCloneNote = new nw.MenuItem({ // this doesn't work out right bc it breaks movement
    //   label: "clone note",
    //   click: function () {
    //     document.body.appendChild(note.cloneNode(true));
    //   },
    // });
    var menuDeleteNote = new nw.MenuItem({
      label: "delete note",
      click: function () {
        if (confirm("delete? real?")) {
          document.body.removeChild(note);
        }
      },
    });
    menu.append(menuPinTop);
    menu.append(menuPinBot);
    menu.append(menuSubmenuColorsHolder);
    // menu.append(menuCloneNote);
    menu.append(menuDeleteNote);
    note.addEventListener("contextmenu", function (ev) {
      ev.preventDefault();
      menu.popup(ev.x, ev.y);
    });

    var noteLabel = document.createElement("input");
    noteLabel.type = "text";
    noteLabel.classList.add("label"); //classing it label might be confusing but whatev
    // noteLabel.contentEditable = true; // already editable as input
    // drop focus on any enter plress
    noteLabel.addEventListener("keydown", function (ev) {
      if (ev.key == "Enter") {
        ev.preventDefault();
        noteLabel.blur();
      }
    });
    // voices placeholder
    //resize grabbable
    noteHandle = document.createElement("div");
    noteHandle.classList.add("noteHandle");
    setResizeable(noteHandle);
    //place on board
    note.appendChild(noteHandle);
    note.appendChild(noteLabel);
    document.body.appendChild(note);
    noteLabel.focus();
    note.style.top = (ev.clientY + 85).toString() + "px";
    note.style.left = (ev.clientX - 20).toString() + "px";
    //attach drag script
    setDraggable(note);

    //extra testing
    // var uploadInputTest = document.createElement("input");
    // uploadInputTest.type = "file";
    // note.appendChild(uploadInputTest);
  }
});

makeVisual.addEventListener("click", async function (ev) {
  var pickerOpts = {
    types: [
      {
        description: "Image formats",
        accept: {
          "image/*": [".png", ".jpg", ".jpeg", ".gif", ".apng", ".webp"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const fileData = await fileHandle.getFile();
  if (!fileData) {
    return;
  } else {
    // //this doesn't work fsr
    // console.log(fileData);
    // var sound = reader.readAsDataURL(file); //i THINK this works?
    var imageBlock = document.createElement("img");
    imageBlock.src = URL.createObjectURL(fileData); //from how i understand this we need to load the dataurl and pass it as the audio source for the element but idk if that is this.
    imageBlock.type = fileData.type;
    imageBlock.style.height = "180px";
    imageBlock.draggable = false;
    // make div inside conditional bc classlist
    var note = document.createElement("div");
    note.classList.add("polaroid");

    // imageBlock.appendChild(source);
    note.appendChild(imageBlock);
    // pin top, pin bottom, delete, change color, etc. need to edit the color settings
    var menu = new nw.Menu();
    var menuPinTop = new nw.MenuItem({
      label: "pin to top",
      click: function () {
        note.classList.add("pinned");
        note.classList.remove("floored");
        note.style.zIndex = (zincrement + 2).toString();
        menuPinTop.label = "unpin from top";
        menuPinTop.click = function () {
          note.classList.remove("pinned");
        };
      },
    });
    var menuPinBot = new nw.MenuItem({
      label: "pin to bottom",
      click: function () {
        note.classList.add("floored");
        note.classList.remove("pinned");
        note.style.zIndex = (zincrement * 0).toString();
        menuPinBot.label = "unpin from bot";
        menuPinBot.click = function () {
          note.classList.remove("floored");
        };
      },
    });
    var menuSubmenuColors = new nw.Menu();
    var menuSubmenuColorsHolder = nw.MenuItem({
      label: "set color:",
      submenu: menuSubmenuColors,
    });
    var submenuColor1 = new nw.MenuItem({
      label: "pale",
      click: function () {
        note.style.backgroundColor = "antiquewhite";
      },
    });
    var submenuColor2 = new nw.MenuItem({
      label: "blue",
      click: function () {
        note.style.backgroundColor = "#3998b4";
      },
    });
    var submenuColor3 = new nw.MenuItem({
      label: "red",
      click: function () {
        note.style.backgroundColor = "#bc536d";
      },
    });
    var submenuColor4 = new nw.MenuItem({
      label: "green",
      click: function () {
        note.style.backgroundColor = "#2da37a";
      },
    });
    menuSubmenuColors.append(submenuColor1);
    menuSubmenuColors.append(submenuColor2);
    menuSubmenuColors.append(submenuColor3);
    menuSubmenuColors.append(submenuColor4);
    // var menuCloneNote = new nw.MenuItem({ // this doesn't work out right bc it breaks movement
    //   label: "clone note",
    //   click: function () {
    //     document.body.appendChild(note.cloneNode(true));
    //   },
    // });
    var menuDeleteNote = new nw.MenuItem({
      label: "delete note",
      click: function () {
        if (confirm("delete? real?")) {
          document.body.removeChild(note);
        }
      },
    });
    menu.append(menuPinTop);
    menu.append(menuPinBot);
    menu.append(menuSubmenuColorsHolder);
    // menu.append(menuCloneNote);
    menu.append(menuDeleteNote);
    note.addEventListener("contextmenu", function (ev) {
      ev.preventDefault();
      menu.popup(ev.x, ev.y);
    });

    var noteLabel = document.createElement("input");
    noteLabel.type = "text";
    noteLabel.classList.add("label"); //classing it label might be confusing but whatev
    // noteLabel.contentEditable = true; // already editable as input
    // drop focus on any enter plress
    noteLabel.addEventListener("keydown", function (ev) {
      if (ev.key == "Enter") {
        ev.preventDefault();
        noteLabel.blur();
      }
    });
    // voices placeholder
    //resize grabbable
    noteHandle = document.createElement("div");
    noteHandle.classList.add("noteHandle");
    setResizeable(noteHandle);
    //place on board
    note.appendChild(noteHandle);
    note.appendChild(noteLabel);
    document.body.appendChild(note);
    noteLabel.focus();
    note.style.top = (ev.clientY + 85).toString() + "px";
    note.style.left = (ev.clientX - 20).toString() + "px";
    //attach drag script
    setDraggable(note);

    // imageBlock.onload() = function () {
    // note.style.width =
    //   (imageBlock.getBoundingClientRect()["width"] + 20).toString() + "px";
    // }
    console.log((imageBlock.naturalWidth + 20).toString());
    console.log(fileData);

    //extra testing
    // var uploadInputTest = document.createElement("input");
    // uploadInputTest.type = "file";
    // note.appendChild(uploadInputTest);
  }
});

document.body.appendChild(radialMenu);

//handles setting radial menu position. generally good
document.body.addEventListener("mousedown", function (ev) {
  // can return later to set var for mod
  // currently this does not apply once we go over the edge of the bounding box. how to fix that if notes steal it down?
  if (ev.shiftKey && !testbutton.checked && ev.buttons == 1) {
    document.body.appendChild(radialMenu);
    radialMenu.style.zIndex = (zincrement + 1).toString();
    buttons.forEach(function (button) {
      setTimeout(function () {
        button.removeAttribute("disabled");
      }, 100);
      if (button == closeMake) {
        button.style.top = (ev.clientY - 25).toString() + "px";
        button.style.left = (ev.clientX - 25).toString() + "px";
      } else {
        button.style.top = (ev.clientY - 45).toString() + "px";
        button.style.left = (ev.clientX - 45).toString() + "px";
      }
    });
    setTimeout(function () {
      testbutton.checked = true;
    }, 50);
  }
  //elif case for closing and reopening / sliding it over
  else if (ev.shiftKey && ev.buttons == 1) {
    buttons.forEach(function (button) {
      if (button == closeMake) {
        button.style.top = (ev.clientY - 25).toString() + "px";
        button.style.left = (ev.clientX - 25).toString() + "px";
      } else {
        button.style.top = (ev.clientY - 45).toString() + "px";
        button.style.left = (ev.clientX - 45).toString() + "px";
      }
    });
  }
  //tie menu close to x or esc rather than clicking off
});
