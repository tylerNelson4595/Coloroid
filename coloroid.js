var areaWidth = 60;
var areaHeight = 60;

var maxClicks = 25;
var numClicks = 0;

var colors = ['#FFA778', '#3BB9FF', '#4E387E', '#ffff99', '#4AA02C', '#CA226B'];


var grid = [];
var container = [];
var action;
var clicksRemaining;
var canvas;
var currentColor;
var moveColor;
var numColors = 6;
var setColor;

/* random coloring function */
function randomColors(n) {
    return Math.floor(Math.random() * n);
}

/* get grid option selected by user */
function drawGrid() {
    getOptions();
    options('gridSize', numRows);
    canvas = document.getElementById('canvas');
    canvas.style.width = numColumns * areaWidth + 'px';
    canvas.style.height = numRows * areaHeight + 'px';

    /* apply grid option and random colors to canvas */
    for (var i = 0; i < numRows; i++) {
        grid[i] = [];
        container[i] = [];

        for (var j = 0; j < numColumns; j++) {
            var colorGrid = randomColors(numColors);
            grid[i][j] = colorGrid;
            container[i][j] = createContainer(i, j, colors[colorGrid]);
        }
    }

    clicksRemaining = document.getElementById('clicksRemaining');
    result();
}

/* determine if player loses or wins */
function result() {
    var finish = grid[0][0];
    var win = (numClicks <= maxClicks);

    if (win)
        for (var i = 0; i < numRows; i++) {

            for (var j = 0; j < numColumns; j++) {
                if (grid[i][j] != finish) {
                    win = false;
                    break;
                }
            }
        }

    /* count number of clicks and output result */
    var outputResult = numClicks + '/' + maxClicks;

    if (win)
        outputResult += '<p><strong>Congratulations, you win!</strong>';

    else if (numClicks >= maxClicks)
        outputResult += '<p><strong>Sorry, you lost.</strong>';

    else if (numClicks == 0)
        outputResult += '<br>';
    clicksRemaining.innerHTML = outputResult;
}

/* create the container with attributes below */
function createContainer(x, y, color) {
    var containerElements = document.createElement("elements");
    containerElements.style.backgroundColor = color;
    containerElements.style.position = "absolute";
    containerElements.style.width = areaWidth + 'px';
    containerElements.style.height = areaHeight + 'px';
    containerElements.style.top = y * areaHeight + 'px';
    containerElements.style.left = x * areaWidth + 'px';
    containerElements.onclick = onClick;
    containerElements.xcoord = x;
    containerElements.ycoord = y;

    canvas.appendChild(containerElements);
    return containerElements;
}


/* position the containers and update click counter */
function onClick(choice) {
    setColor = choice;

    var action = [0, 0];
    var currentColor = grid[0][0];


    var moveColor = setColor;

    if (currentColor == moveColor) return;
    numClicks++;
    fill(action, currentColor, moveColor);
}

/* fill to the appropriate clicked color */
function fill(action, currentColor, moveColor) {
    var newAction = [];

    while (action.length > 1) {
        var y = action.pop();
        var x = action.pop();

        if (currentColor != grid[x][y]) continue;

        grid[x][y] = moveColor;
        container[x][y].style.backgroundColor = colors[moveColor];

        if (x < numColumns - 1 && grid[x + 1][y] == currentColor)
            newAction.push(x + 1, y);

        if (y < numRows - 1 && grid[x][y + 1] == currentColor)
            newAction.push(x, y + 1);

        if (x > 0 && grid[x - 1][y] == currentColor)
            newAction.push(x - 1, y);

        if (y > 0 && grid[x][y - 1] == currentColor)
            newAction.push(x, y - 1);
    }

    if (newAction.length > 0)
        setTimeout(function() {
            fill(newAction, currentColor, moveColor);
        }, 50);

    else
        result();
}

/* determine grid option selected */
function options(name, value) {
    var select = document.getElementsByName(name)[0];

    for (var i = 0; i < select.options.length; i++)
        if (select.options[i].value == value) {
            select.selectedIndex = i;
            break;
        }
}

/* apply grid options */
function getOptions() {
    var optionSearch = location.search;
    optionSearch = optionSearch.substr(1);
    var attributes = optionSearch.split('&');

    for (var i = 0; i < attributes.length; i++) {
        var setAttributes = attributes[i].split('=');
        var selectedGrid = setAttributes[0];
        var setGrid = setAttributes[1];

        if (selectedGrid == 'gridSize')
            numRows = numColumns = setGrid;
    }
    maxClicks = Math.floor((numRows * numColumns) / (2));
}