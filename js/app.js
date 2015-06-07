
var path = [];

var recordInterval = 5;
var record = true;
var h = window.innerHeight;
var w = window.innerWidth;


var critters = [];

var setup = function(){
  colorMode(HSB, 1, 1, 1);
  rectMode(CENTER)
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
}

var draw = function(){

  background(0);

  critters.forEach(function(c){
   c.update();
   c.draw();
  });


  for(var i = 0; i<path.length-1; i++){
      strokeWeight(4);
      stroke(0,0,1);
  //    line(path[i].x, path[i].y, path[i+1].x, path[i+1].y);

    point(this.path[i].x, this.path[i].y);
  }
}

var mouseDragged = function(){
    if(record){
    path.push(createVector(mouseX,mouseY));
    record = false;
    window.setTimeout(function(){
        record = true;
      }, recordInterval);
    }
}

var mouseReleased = function(){
  console.log('create object');
  var c = new Crawl(path);
  critters.push(c);
  path = [];
}

function Crawl(path) {
  this.path = path;
}

Crawl.prototype.yellowtail= function(){
  var first = this.path.shift();
  var diff = p5.Vector.sub(this.path[0],first);
  var step = p5.Vector.add(this.path[this.path.length-1],diff);
  this.path.push(step);
}

Crawl.prototype.mirrorLooper= function(){
  var first = this.path.shift();
  var diff = p5.Vector.sub(this.path[0],first);
  diff.mult(-1);
  var step = p5.Vector.add(this.path[this.path.length-1],diff);
  this.path.push(step);
}

Crawl.prototype.flow= function(){
  var first = this.path.shift();

  var diff = p5.Vector.sub(this.path[0],first);
  var diff2 = p5.Vector.sub(this.path[1],this.path[0]);

  // angle between
  var angle = p5.Vector.angleBetween(diff2, diff);

  //magnitude
  var mag = diff.mag();

  var interval= p5.Vector.sub(this.path[this.path.length-1], this.path[this.path.length-2]);
 // interval.setMag(mag);
  interval.rotate(angle);
  var step = p5.Vector.add(this.path[this.path.length-1],interval);
  this.path.push(step);

}


Crawl.prototype.update = function(){
 // this.flow();
  //this.yellowtail();
  this.mirrorLooper();
}


Crawl.prototype.draw = function(){
  var dists = this.path.map(function(p,i, path){
              if(typeof(path[i+1]) !== "undefined"){
                return p5.Vector.dist(path[i], path[i+1]);
              } else{
                  return 0;
              }
          });

  var maxVal = Math.max.apply(null, dists);
  for(var i = 0; i<this.path.length-1; i++){
    var len = p5.Vector.dist(this.path[i], this.path[i+1]);
    strokeWeight(10);
    stroke(0.5* (len/maxVal),1,1);
    line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y);

  }
}


