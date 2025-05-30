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
var makeVideo = document.createElement("button");
makeVideo.textContent = "video";
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
var buttons = [makeNote, makeAudio, makeVideo, makeDraw, makePin, closeMake];
buttons.forEach(function (button) {
  button.setAttribute("disabled", "disabled");
  button.addEventListener("click", function () {
    testbutton.checked = false;
    // document.removeChild(radialMenu); //doesn't work
    // keeping this option here in case we want to fly away the vanish based on where it was clicked
    buttons.forEach(function (button) {
      button.setAttribute("disabled", "disabled");
      // enable this again or set timeout on button
      button.style.top = (-45).toString() + "px";
      button.style.left = (-45).toString() + "px";
    });
  });

  radialMenu.appendChild(button);
});

// function for dragging
function setDraggable(elem) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  document.onmousedown = dragMouseDown();

  function dragMouseDown(ev) {
    ev.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = stopDragging;
    // call a function whenever the cursor moves:
    document.onmousemove = dragItem;
  }

  function dragItem(ev) {
    ev.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elem.style.top = elem.offsetTop - pos2 + "px";
    elem.style.left = elem.offsetLeft - pos1 + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
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
  } else if (ev.key == "ArrowUp") {
    // code for moving up a line
    // additional code for moving the line up?
  } else if (ev.key == "ArrowDown") {
    // repeat for down
  }
  // delete case, move to next
  else if (
    ev.key == "Backspace" &&
    ev.target.textContent == "" &&
    ev.target.parentElement.childElementCount > 1
  ) {
    note.removeChild(ev.target);
    // then set focus to next
  }
  //backspace case, move to prev
  else if (
    ev.key == "Backspace" &&
    ev.target.textContent == "" &&
    ev.target.parentElement.childElementCount > 1
  ) {
    note.removeChild(ev.target);
    // then set focus to preventDefault
  }
}

//independent operations, making elements
//text note, editable paragraphs inside div
//  start with 1 div 1 p, ret makes new blank, ret in blank clears and exits focus
makeNote.addEventListener("click", function (ev) {
  //make div, child p
  var note = document.createElement("div");
  note.classList.add("note"); //base class for notes specifically, not the other graphics
  var noteText = document.createElement("p");
  noteText.classList.add("text");
  noteText.contentEditable = true;
  // noteText.addEventListener("keydown", noteText, noteP);
  noteText.addEventListener("keydown", function (ev) {
    lineBreak(ev, note);
  });
  //eventually we need to do voices, that prob goes here

  //place on board
  note.appendChild(noteText);
  document.body.appendChild(note);
  noteText.focus();
  note.style.top = (ev.clientY + 85).toString() + "px";
  note.style.left = (ev.clientX - 20).toString() + "px";
  //attach drag script? or can we handle that glob
  setDraggable(note);
});

document.body.appendChild(radialMenu);

document.body.addEventListener("mousedown", function (ev) {
  // can return later to set var for mod
  // currently this does not apply once we go over the edge of the bounding box. how to fix that if notes steal it down?
  if (ev.shiftKey && !testbutton.checked && ev.buttons == 1) {
    buttons.forEach(function (button) {
      setTimeout(function () {
        button.removeAttribute("disabled");
      }, 200);
      if (button == closeMake) {
        button.style.top = (ev.clientY - 25).toString() + "px";
        button.style.left = (ev.clientX - 25).toString() + "px";
      } else {
        button.style.top = (ev.clientY - 45).toString() + "px";
        button.style.left = (ev.clientX - 45).toString() + "px";
      }
    });
    testbutton.checked = true;
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
