var drawSize = 1; // Determines initial draw space size.
var drawZoom = 1; // Determines the zoom level of the viewport. Higher numbers are a higher zoom.
var drawUnits = drawZoom / drawSize; // Determines scale of units.
var screenCenterX = window.innerWidth / 2;
var screenCenterY = window.innerHeight / 2;
var drawCenterX = 0;
var drawCenterY = 0;

// Example of modifying initial draw coordinates based off the zoom.
var draw = function(target) {
  ctx.beginPath();

  drawRadius = target.radius * drawUnits;
  drawX = (target.px - drawCenterX) * drawUnits + screenCenterX;
	drawY = (target.py - drawCenterY) * drawUnits + screenCenterY;

  ctx.moveTo(drawX, drawY);
  ctx.arc(drawX, drawY, drawRadius, 0, 2 * Math.PI, true);

  ctx.fill();
}