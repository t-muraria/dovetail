// Window.showDevTools();

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
makeAudio.textContent = "audio";
var makeVisual = document.createElement("button");
makeVisual.textContent = "visual";
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
    zincrement++;
  }
}

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
    elem.parentElement.style.height =
      (elem.parentElement.getBoundingClientRect()["height"] - pos2).toString() +
      "px";
    elem.parentElement.style.width =
      (elem.parentElement.getBoundingClientRect()["width"] - pos1).toString() +
      "px";
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
      note.appendChild(newP);
      newP.focus();
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
    icon: "../assets/puff.jpg",
    click: function () {
      note.style.backgroundColor = "antiquewhite";
    },
  });
  var submenuColor2 = new nw.MenuItem({
    label: "blue",
    icon: "../assets/blue.jpg",
    click: function () {
      note.style.backgroundColor = "#3998b4";
    },
  });
  var submenuColor3 = new nw.MenuItem({
    label: "red",
    icon: "../assets/red.jpg",
    click: function () {
      note.style.backgroundColor = "#bc536d";
    },
  });
  var submenuColor4 = new nw.MenuItem({
    label: "green",
    icon: "../assets/green.jpg",
    click: function () {
      note.style.backgroundColor = "#2da37a";
    },
  });
  menuSubmenuColors.append(submenuColor1);
  menuSubmenuColors.append(submenuColor2);
  menuSubmenuColors.append(submenuColor3);
  menuSubmenuColors.append(submenuColor4);
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
