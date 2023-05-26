let directions = ["NE","E","SE","S","SW","W","NW","N"]

function drawClock(angle) {
  // let canvas = document.getElementById("canvas");
  // let ctx = canvas.getContext("2d");
  // let radius = canvas.height / 2;
  // ctx.translate(radius, radius);
  // radius = radius * 0.90
  drawFace(ctx, radius);
  drawDirection(ctx, radius);
  let pos = (angle / 180) * Math.PI;
  drawHand(ctx,pos, radius*0.9, radius*0.02);
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();

  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  //ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.03, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function drawDirection(ctx, radius) {
  let ang;
  //let direction;
  //let directions = ["NE","E","SE","S","SW","W","NW","N"]
  ctx.font = radius*0.2 + "px sans-serif";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for (let direc = 1; direc < 9; direc++) {
    ang = (direc * Math.PI) / 4;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.75);
    ctx.rotate(-ang);
    ctx.fillText(directions[direc-1], 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.75);
    ctx.rotate(-ang);
  }
}

function drawHand(ctx, pos, length, width) {
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}

function up() {
  const request =new XMLHttpRequest()
  request.open('GET','https://api.netpie.io/v2/device/shadow/data')
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader('Authorization', 'Basic ' + btoa('6a6e60b7-0a76-4f05-8f9c-892f30563e60:kbz2EPS9xdp399K7LE9aCS3Sg2kPPLmU'));
  request.send()
  request.onload = () => {
    var text1=JSON.parse(request.responseText)
    if (text1.data.water_level >= 1.8) {
      document.getElementById("s_box").innerHTML = "ท่วม";
      document.getElementById("s_box").className = "red_status";
    } else {
      document.getElementById("s_box").innerHTML = "ไม่ท่วม";
      document.getElementById("s_box").className = "green_status";
    }
    let water_height = 97 - text1.data.ultrasonic;
    if (water_height.toFixed(2) < 0) {
      water_height = 0;
    } else {
      water_height = water_height.toFixed(2);
    }
    document.getElementById("ultrasonic").innerHTML= "" + water_height;
    document.getElementById("water_flow").innerHTML=  "" + text1.data.water_flow;
    document.getElementById("water_level").innerHTML= "" + text1.data.water_level;
    //document.getElementById("angle").innerHTML= "" + text1.data.angle;
    document.getElementById("angle").innerHTML= "" + text1.data.angle + "<sup>o</sup>";
    drawClock(text1.data.angle);
  }
}

let canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 1000;
let ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90

//drawClock(120);
//document.getElementById("angle").innerHTML= "" + text1.data.angle + "<sup>o</sup>";
//document.getElementById("angle").innerHTML= "150<sup>o</sup>";

drawClock(0);
up();
setInterval(up,1000);