/** Add your relevant code here for the issue to reproduce */

"use client";

import { useEffect, useRef } from "react";
import io from "socket.io-client";
import "./globals.css";
import { HexColorPicker } from "react-colorful";

let socket;
let currentColorChoice = '#aabbcc';

export default function Home() {
  const pixelTable = useRef(null);
  const cursor = useRef(null);

  const setCurrentColorChoice = (color) => {
    currentColorChoice = color;
  }

  const socketInitializer = () => {
    // We call this just to make sure we turn on the websocket server
    fetch("/api/socket");

    socket = io(undefined, {
      path: "/api/socketio",
    });

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });
  };

  useEffect(() => {
    pixelTable.current.width = 1000;
    pixelTable.current.height = 700;
    const cellSize = 10;
    const ctx = pixelTable.current.getContext('2d');
    const gridCtx = pixelTable.current.getContext('2d');

    function makeCell(x, y, color) {
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.fillRect(x, y, cellSize, cellSize)
    }

    function drawCellOnGrid() {
      const x = cursor.current.offsetLeft
      const y = cursor.current.offsetTop - pixelTable.current.offsetTop
      makeCell(x, y, currentColorChoice)
  
      const pixel = {x,y,color: currentColorChoice}
      socket.emit('createdPixel', pixel)
      console.log("Send new pixel", pixel);
    }

    cursor.current.addEventListener('click', function (event) {
      drawCellOnGrid()
    })
    pixelTable.current.addEventListener('click', function () {
      drawCellOnGrid()
    })

    function displayGrid(ctx, width, height, cellWidth, cellHeight) {
      ctx.beginPath();
      ctx.strokeStyle = "#CCCCCC";
  
      for (let i = 0; i < width; i++) {
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
      }
  
      for (let i = 0; i < height; i++) {
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
      }
      ctx.stroke()
    }

    displayGrid(gridCtx, pixelTable.current.width, pixelTable.current.height, cellSize, cellSize)

    pixelTable.current.addEventListener('mousemove', function (event) {
      const cursorLeft = event.clientX - (cursor.current.offsetWidth / 2)
      const cursorTop = event.clientY - (cursor.current.offsetHeight / 2)
      cursor.current.style.left = Math.floor(cursorLeft / cellSize) * cellSize + "px"
      cursor.current.style.top = Math.floor(cursorTop / cellSize) * cellSize + "px"
    })

    socketInitializer();
    socket.on("newIncomingPixel", (pixel) => {
      console.log("New incoming pixel", pixel);
      makeCell(pixel.x, pixel.y, pixel.color);
    });

    // get all pixels from api

    fetch('/api/pixel')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        data.forEach(pixel => {
          const coord = pixel.id.split('-')
          makeCell(Number(coord[0]), Number(coord[1]), pixel.color)
        })
      })
  }, []);

  return (
    <main className="flex min-h-screen flex-col gap-8 justify-start bg-dark">

      <div ref={cursor} id="cursor"></div>
      <canvas id='pixelTable' ref={pixelTable} className="w-1/2 h-1/2 bg-white" />

      <HexColorPicker color={currentColorChoice} onChange={setCurrentColorChoice} />
    </main>
  );
}
