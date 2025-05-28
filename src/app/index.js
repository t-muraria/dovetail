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
  button.addEventListener("click", function (ev) {
    testbutton.checked = false;
    // keeping this option here in case we want to fly away the vanish based on where it was clicked
    // buttons.forEach(function (button) {
    //   button.style.top = ev.clientY.toString() + "px";
    //   button.style.left = ev.clientX.toString() + "px";
    // });
  });
  radialMenu.appendChild(button);
});

//independent operations, making elements
//text note, editable paragraphs inside div
//  start with 1 div 1 p, ret makes new blank, ret in blank clears and exits focus
makeNote.addEventListener("click", function (ev) {
  //ev for location of click? can we pull from menu at all
  //look into script variable instead of local func variable
  //make div, child p
  var note = document.createElement("div");
  note.classList.add("note"); //base class
  note.contentEditable = true;
  // note.classList.add("text"); //text specifics
  //p
  var noteText = document.createElement("p");
  noteText.classList.add("text");
  noteText.textContent = "awawawa";
  noteText.addEventListener("keydown", function (ev) {
    if (ev.ctrlKey && ev.key == "Enter") {
      document.body.focus(); //not working w this or blur.
    }
  });
  //eventually we need to do voices, that prob goes here
  //attach drag script? or can we handle that glob

  //place on board
  note.appendChild(noteText);
  document.body.appendChild(note);
  note.style.top = ev.clientY.toString() + "px";
  note.style.left = ev.clientX.toString() + "px";
});

document.body.appendChild(radialMenu);

document.body.addEventListener("mousedown", function (ev) {
  // can return later to set var for mod
  if (ev.shiftKey && !testbutton.checked && ev.buttons == 1) {
    buttons.forEach(function (button) {
      button.style.top = ev.offsetY.toString() + "px";
      button.style.left = ev.offsetX.toString() + "px";
    });
    testbutton.checked = true;
  }
  //elif case for closing and reopening / sliding it over
  //tie menu close to x or esc rather than clicking off
});
