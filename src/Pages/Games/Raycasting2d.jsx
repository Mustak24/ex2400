import { useEffect, useRef, useState } from "react";

class Ray {
  constructor(x, y, numberOfRay = 100, maxMgnitude = 500) {
    this.x = x;
    this.y = y;
    this.numberOfRay = numberOfRay;
    this.rays = [];
    this.maxMagnitude = maxMgnitude;

    for (let i = 0; i < this.numberOfRay; i++) {
      let angle = (2 * i * Math.PI) / this.numberOfRay;
      let x = this.maxMagnitude * Math.cos(angle);
      let y = this.maxMagnitude * Math.sin(angle);
      this.rays.push(new Line(this.x, this.y, this.x + x, this.y + y));
    }
  }

  show(context) {
    for (let ray of this.rays) {
      ray.show(context);
    }
  }

  look(walls) {
    let points = [];
    for (let i = 0; i < this.rays.length; i++) {
      let minDis = Infinity;
      let closetPoint = null;

      for (let wall of walls) {
        let inter = Line.getIntersect(this.rays[i], wall);

        if (!inter) continue;

        let dis = Line.findDistance(this.x, this.y, inter[0], inter[1]);

        if (minDis > dis) {
          minDis = dis;
          closetPoint = inter;
        }
      }

      if (closetPoint) {
        points.push(closetPoint);
        this.rays[i].setPointB(...closetPoint);
      }
    }
    return points;
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  getPointA() {
    return [this.x1, this.y1];
  }

  getPointB() {
    return [this.x2, this.y2];
  }

  getMagnitude() {
    return Math.sqrt(
      Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2)
    );
  }

  getSlope() {
    if (this.dx() == 0) return null;
    return this.dy() / this.dx();
  }

  getLineEquation() {
    // (x2-x1)(y-y1) + (y1-y2)(x-x1) = 0
    // y(x2-x1) + x(y1-y2) - y1(x2-x1) - x1(y1-y2) = 0
    // y(x2-x1) + x(y1-y2) - y1x2 + y1x1 - x1y1 + x1y2 = 0
    // x(y1-y2) + y(x2-x1) + x1y2 - x2y1 = 0

    let a = this.y1 - this.y2;
    let b = this.x2 - this.x1;
    let c = this.x1 * this.y2 - this.x2 * this.y1;
    return [a, b, c];
  }

  dx() {
    return this.x2 - this.x1;
  }
  dy() {
    return this.y2 - this.y1;
  }

  setPointA(x, y) {
    if (x && y) {
      this.x1 = x;
      this.y1 = y;
    }
  }

  setPointB(x, y) {
    if (x && y) {
      this.x2 = x;
      this.y2 = y;
    }
  }

  static getIntersect(l1, l2, inRange = true) {
    let [a1, b1, c1] = l1.getLineEquation();
    let [a2, b2, c2] = l2.getLineEquation();

    let m = a1 * b2 - a2 * b1;

    if (m === 0) return null;

    c1 = -c1;
    c2 = -c2;

    let mx = c1 * b2 - c2 * b1;
    let my = a1 * c2 - a2 * c1;

    let x = mx / m;
    let y = my / m;

    if (!inRange) return [x, y];

    let isL1InRange = l1.hasPoint(x, y);
    let isL2InRange = l2.hasPoint(x, y);

    return isL1InRange && isL2InRange ? [x, y] : null;
  }

  hasPoint(x, y) {
    let ab = Line.findDistance(x, y, this.x1, this.y1);
    let bc = Line.findDistance(x, y, this.x2, this.y2);
    let ac = this.getMagnitude();

    let error = Math.abs(ac - (ab + bc));
    return error <= 1;
  }

  getValueOn(x) {
    if (this.getSlope() == null) return null;
    return this.getSlope() * (x - this.x1) + this.y1;
  }

  show(context) {
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.stroke();
  }

  static findDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}

function useCurrentState(initialValue) {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state; // Keep ref updated with the latest state
  }, [state]);

  const getState = () => stateRef.current; // Function to get latest state

  return [state, setState, getState];
}

export default function Raycasting2d({ frameRate = 24 }) {
  const [numberOfWalls, setNumberOfWalls] = useState(3);
  const [_walls, setWalls, getWalls] = useCurrentState(createWalls(numberOfWalls));
  const [numberOfRays, setNumberOfRays, getNumberOfRays] = useCurrentState(100);
  const [windowEvent, setWindowEvent, getWindowEvent] = useCurrentState({});
  const canvas = useRef(null);

  function createWalls(n) {
    let walls = [];
    let { innerWidth: w, innerHeight: h } = window;
    for (let i = 0; i < n; i++) {
      let x1 = Math.random() * w;
      let y1 = Math.random() * h;
      let x2 = Math.random() * w;
      let y2 = Math.random() * h;
      walls.push(new Line(x1, y1, x2, y2));
    }
    return walls;
  }

  function draw(context) {
    let {innerWidth:width, innerHeight:height} = window;
    
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.canvas.width = width;
    context.canvas.height = height;

    let walls = getWalls();
    
    walls.push(new Line(0, 0, width, 0));
    walls.push(new Line(width, 0, width, height));
    walls.push(new Line(width, height, 0, height));
    walls.push(new Line(0, height, 0, 0));
    
    for (let wall of walls) {
      context.strokeStyle = "rgb(255,255,255,.8)";
      wall.show(context);
    }

    let event = getWindowEvent();

    let rayX = event.clientX || width / 2;
    let rayY = event.clientY || height / 2;
    let maxMagnitude = Math.max(
      Line.findDistance(rayX, rayY, 0, 0),
      Line.findDistance(rayX, rayY, width, 0),
      Line.findDistance(rayX, rayY, width, height),
      Line.findDistance(rayX, rayY, 0, height)
    );

    let ray = new Ray(rayX, rayY, getNumberOfRays(), maxMagnitude);

    let points = ray.look(walls);
    for (let point of points) {
      context.beginPath();
      context.arc(point[0], point[1], 5, 0, 2 * Math.PI);
      context.fillStyle = "white";
      context.fill();
      context.stroke();
    }

    context.strokeStyle = "rgb(255,255,255,.2)";
    ray.show(context);

    setTimeout(() => {
      requestAnimationFrame(() => draw(context));
    }, 1000 / frameRate);
  }

  useEffect(() => {
    setWalls(createWalls(numberOfWalls));
  }, [numberOfWalls]);

  useEffect(() => {
    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");
    requestAnimationFrame(() => draw(context));
  }, [canvas]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, []);

  function handleMouseMove(e) {
    if(e.touches)
      setWindowEvent(e.touches[0]);
    else
      setWindowEvent(e);
  }

  return (
    <>
      <main className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center gap-10 py-5 px-5 sm:px-10 overflow-hidden">
        <canvas
          ref={canvas}
          id="canvas"
          className="min-w-screen min-h-screen bg-zinc-900 mx-5"
        ></canvas>
        <div className="flex fixed max-sm:flex-col sm:gap-20 gap-5 top-2 left-2 opacity-50 hover:opacity-100 transition-all duration-100 [&_div]:flex [&_div]:items-center [&_div]:gap-5">
          <div>
            <input
              type="range"
              title="walls"
              min={0}
              max={10}
              value={numberOfWalls}
              onChange={(e) => setNumberOfWalls(e.target.value)}
            />
            {numberOfWalls}
          </div>
          <div>
            <input
              type="range"
              min={100}
              max={2000}
              value={numberOfRays}
              onChange={(e) => setNumberOfRays(e.target.value)}
            />
            {numberOfRays}
          </div>
        </div>
      </main>
    </>
  );
}
