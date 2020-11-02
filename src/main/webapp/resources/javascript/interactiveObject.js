document.getElementById("chart").innerHTML = '<canvas id="canvas" width="350" height="350""></canvas>';

const form = document.getElementById("newEntryForm");
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const blue = "#b8daff";

function redraw() {
    let R = getR();
    let rad = height / 40;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = blue;
    ctx.fillRect(width / 2, height / 2, 2 / 6 * width, - 1 / 6 * height);
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.arc(width / 2, height / 2, 1 / 6 * height, 0,  0.5 * Math.PI);
    ctx.lineTo(width / 2, height / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(1 / 6 * width, height / 2);
    ctx.lineTo(width / 2, 4 / 6 * height);
    ctx.lineTo(width / 2, height / 2);
    ctx.fill();

    ctx.fillStyle = "black";
    canvas_arrow(ctx, width / 2, height - rad, width / 2, rad);
    canvas_arrow(ctx, rad, height / 2, width - rad, height / 2);
    ctx.fillText("X", Number(width) - rad - 5, height / 2 - rad);
    ctx.fillText("Y", width / 2 + rad, rad + 5);

    if (R != null && isFinite(R) && R >= 1 && R <= 4){
        addMark((-R).toFixed(3), width / 2, 5 / 6 * height);
        addMark((-R/2).toFixed(3), width / 2, 4 / 6 * height);
        addMark((R/2).toFixed(3), width / 2, 2 / 6 * height);
        addMark(R.toFixed(3), width / 2, 1 / 6 * height);
        addMark((R/2).toFixed(3), 4 / 6 * width, height / 2);
        addMark(R.toFixed(3), 5 / 6 * width, height / 2);
        addMark((-R/2).toFixed(3), 2 / 6 * width, height / 2);
        addMark((-R).toFixed(3), 1 / 6 * width, height / 2);

        paintPoints(R);
    }
}

function addMark(label, x, y) {
    let rad = height / 40;
    if (x === width / 2) {
        ctx.beginPath();
        ctx.moveTo(x - rad / 2, y);
        ctx.lineTo(x + rad / 2, y);
        ctx.stroke();
        ctx.fillText(label, x + rad, y);
    }
    if (y === height / 2) {
        ctx.beginPath();
        ctx.moveTo(x, y - rad / 2);
        ctx.lineTo(x, y + rad / 2);
        ctx.stroke();
        ctx.fillText(label, x, y - rad);
    }
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
    let headlen = 5; // length of head in pixels
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);

    ctx.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function getPoints() {
    const points = [];
    const headers = Array.from(document.querySelectorAll("#entriesTable th")).map(header => header.innerHTML.replace(/\s/g, ""));
    Array.prototype.map.call(document.querySelectorAll('#entriesTable tr'), function(tr){
        let cells = Array.from(tr.querySelectorAll('td')).map(cell => cell.innerHTML.replace(/\s/g, ""));
        let point = new Map();
        for (let i = 0; i < cells.length; i++) {
            point.set(headers[i], cells[i]);
        }
        if (cells.length !== 0) points.push(point);
    });
    return points;
}

function paintPoints(R) {
    getPoints().forEach(function (point) {
        if (!Array.from(point.values()).includes("")){
            let x = width / 2 + Number(point.get('X')) * Math.round(width / 3)  / Number(R);
            let y = height / 2 - Number(point.get('Y')) * Math.round(height / 3) / Number(R);
            if (checkHit(Number(point.get('X')), Number(point.get('Y')), R)){
                paintPoint(x, y, "black")
            } else paintPoint(x, y, "red");
        }
    });
}

function paintPoint(x, y, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
}

function checkHit(x, y, r) {
    if ((y === 0 && Math.abs(x) <= r) || (x === 0 && Math.abs(y) <= r / 2)) return  true;
    if ((x < 0) && (y < 0)) return  y >= - (r / 2) - (x / 2);
    if ((x > 0) && (y > 0)) return (x <= r) && (y <= r / 2);
    if ((x > 0) && (y < 0)) return  x * x + y * y <= (r * r) / 4;
    if ((x < 0) && (y > 0)) return false;
}

function getR(){
    let R = parseFloat(form[form.id + ":R_field"].value);
    if (isNaN(R)) R = null;
    return R;
}

function clickOnCanvas(event) {
    let r = getR();
    if (r == null) {
        form[form.id + ":R_field"].focus();
    } else {
        const x = event.pageX - (canvas.getBoundingClientRect().left + pageXOffset);
        const y = event.pageY - (canvas.getBoundingClientRect().top + pageYOffset);

        const cordX = ((x - width / 2) * Number(r) / Math.round(width / 3)).toFixed(3);
        const cordY = ((height / 2 - y) * Number(r) / Math.round(height / 3)).toFixed(3);

        form[form.id + ":X_field"].value = cordX;
        form[form.id + ":Y_field"].value = cordY;
        form[form.id + ":R_field"].value = r;
        form[form.id + ":submitButton"].click();
    }
}

{
    document.getElementById("canvas").onclick = clickOnCanvas;
    form[form.id + ":R_field"].oninput = redraw;
    redraw();
}