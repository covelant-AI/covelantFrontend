"use client";

import React, { useEffect, useRef } from 'react';

interface BounceLocation {
  location: number[];
  state: string;
}

interface Stroke {
  player_hit: 'top' | 'bottom';
  bounce: BounceLocation | null;
}

interface Rally {
  strokes: Stroke[];
}

interface HeatmapVisualizationProps {
  data: Rally[];
  selectedPlayer: 'top' | 'bottom';
}

export default function HeatmapVisualization({ data, selectedPlayer }: HeatmapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with high DPI support
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    
    ctx.scale(dpr, dpr);
    
    const width = containerWidth;
    const height = containerHeight;

    // Court dimensions and boundaries
    const courtWidth = 8.23;
    const courtLength = 23.77;
    const xMin = -10;
    const xMax = 10;
    const yMin = -15;
    const yMax = 15;

    // Extract bounce locations for both players
    // Only include bounces on opponent's side of the court
    // Net hits are included at y=0
    const topPlayerBounces: number[][] = [];
    const bottomPlayerBounces: number[][] = [];
    
    data.forEach(rally => {
      rally.strokes.forEach(stroke => {
        if (stroke.bounce && stroke.bounce.location) {
          const [x, y] = stroke.bounce.location;
          const isNetHit = stroke.bounce.state === 'net_hit';
          
          if (stroke.player_hit === 'top') {
            // Top player - show bounces on bottom half (y < 0) or net hits at y=0
            if (y < 0) {
              topPlayerBounces.push(stroke.bounce.location);
            } else if (isNetHit) {
              topPlayerBounces.push([x, 0]); // Net hits at center line
            }
          } else if (stroke.player_hit === 'bottom') {
            // Bottom player - show bounces on top half (y > 0) or net hits at y=0
            if (y > 0) {
              bottomPlayerBounces.push(stroke.bounce.location);
            } else if (isNetHit) {
              bottomPlayerBounces.push([x, 0]); // Net hits at center line
            }
          }
        }
      });
    });

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Coordinate transformation functions
    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);
    const toCanvasX = (x: number) => (x - xMin) * scaleX;
    const toCanvasY = (y: number) => height - (y - yMin) * scaleY;

    // Helper function to create and populate density grid
    const createDensityGrid = (bounces: number[][], numBins: number) => {
      const grid: number[][] = Array(numBins).fill(0).map(() => Array(numBins).fill(0));
      
      bounces.forEach(([x, y]) => {
        // Only include bounces within the valid range
        if (x < xMin || x > xMax || y < yMin || y > yMax) {
          return; // Skip bounces outside the boundaries
        }
        
        const binX = Math.floor(((x - xMin) / (xMax - xMin)) * (numBins - 1));
        const binY = Math.floor(((y - yMin) / (yMax - yMin)) * (numBins - 1));
        
        if (binX >= 0 && binX < numBins && binY >= 0 && binY < numBins) {
          grid[binY][binX]++;
        }
      });
      
      return grid;
    };
    
    // Create density grids for both players
    const numBins = 150;
    const topPlayerGrid = createDensityGrid(topPlayerBounces, numBins);
    const bottomPlayerGrid = createDensityGrid(bottomPlayerBounces, numBins);

    // Helper function to apply Gaussian smoothing
    const applyGaussianSmoothing = (grid: number[][], numBins: number) => {
      const sigma = 2.0;
      const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
      const kernel: number[] = [];
      let kernelSum = 0;
      
      for (let i = 0; i < kernelSize; i++) {
        const x = i - Math.floor(kernelSize / 2);
        const val = Math.exp(-(x * x) / (2 * sigma * sigma));
        kernel.push(val);
        kernelSum += val;
      }
      
      // Normalize kernel
      for (let i = 0; i < kernelSize; i++) {
        kernel[i] /= kernelSum;
      }

      // Smooth horizontally
      const smoothedGrid1: number[][] = Array(numBins).fill(0).map(() => Array(numBins).fill(0));
      for (let y = 0; y < numBins; y++) {
        for (let x = 0; x < numBins; x++) {
          let sum = 0;
          for (let k = 0; k < kernelSize; k++) {
            const nx = x + k - Math.floor(kernelSize / 2);
            if (nx >= 0 && nx < numBins) {
              sum += grid[y][nx] * kernel[k];
            }
          }
          smoothedGrid1[y][x] = sum;
        }
      }

      // Smooth vertically
      const smoothedGrid: number[][] = Array(numBins).fill(0).map(() => Array(numBins).fill(0));
      for (let y = 0; y < numBins; y++) {
        for (let x = 0; x < numBins; x++) {
          let sum = 0;
          for (let k = 0; k < kernelSize; k++) {
            const ny = y + k - Math.floor(kernelSize / 2);
            if (ny >= 0 && ny < numBins) {
              sum += smoothedGrid1[ny][x] * kernel[k];
            }
          }
          smoothedGrid[y][x] = sum;
        }
      }
      
      return smoothedGrid;
    };
    
    // Apply smoothing to both grids
    const topPlayerSmoothed = applyGaussianSmoothing(topPlayerGrid, numBins);
    const bottomPlayerSmoothed = applyGaussianSmoothing(bottomPlayerGrid, numBins);

    // Helper function to normalize grid using 95th percentile
    const normalizeGrid = (grid: number[][], numBins: number) => {
      const allValues: number[] = [];
      for (let y = 0; y < numBins; y++) {
        for (let x = 0; x < numBins; x++) {
          if (grid[y][x] > 0) {
            allValues.push(grid[y][x]);
          }
        }
      }
      
      allValues.sort((a, b) => a - b);
      const percentile95Index = Math.floor(allValues.length * 0.95);
      return allValues.length > 0 ? allValues[percentile95Index] || allValues[allValues.length - 1] : 1;
    };

    const topPlayerMaxVal = normalizeGrid(topPlayerSmoothed, numBins);
    const bottomPlayerMaxVal = normalizeGrid(bottomPlayerSmoothed, numBins);

    // Helper function to draw heatmap with specific color using alpha blending
    const drawHeatmap = (grid: number[][], maxVal: number, color: { r: number, g: number, b: number }, isDimmed: boolean) => {
      const binWidth = width / numBins;
      const binHeight = height / numBins;

      for (let y = 0; y < numBins; y++) {
        for (let x = 0; x < numBins; x++) {
          let intensity = maxVal > 0 ? grid[y][x] / maxVal : 0;
          
          // Clamp to [0, 1] and apply slight power curve
          intensity = Math.min(1, intensity);
          intensity = Math.pow(intensity, 0.7);
          
          if (intensity > 0.01) {
            // Use alpha blending to allow colors to mix where they overlap
            // Dimmed player has reduced alpha (30% of normal)
            const baseAlpha = isDimmed ? 0.3 : 0.7;
            const alpha = intensity * baseAlpha;
            
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            ctx.fillRect(x * binWidth, (numBins - 1 - y) * binHeight, binWidth + 1, binHeight + 1);
          }
        }
      }
    };

    // Draw heatmaps - unselected player first (underneath), selected player second (on top)
    if (selectedPlayer === 'top') {
      // Draw bottom player first (dimmed, underneath)
      drawHeatmap(bottomPlayerSmoothed, bottomPlayerMaxVal, { r: 254, g: 142, b: 37 }, true);
      // Draw top player second (bright, on top)
      drawHeatmap(topPlayerSmoothed, topPlayerMaxVal, { r: 66, g: 182, b: 177 }, false);
    } else {
      // Draw top player first (dimmed, underneath)
      drawHeatmap(topPlayerSmoothed, topPlayerMaxVal, { r: 66, g: 182, b: 177 }, true);
      // Draw bottom player second (bright, on top)
      drawHeatmap(bottomPlayerSmoothed, bottomPlayerMaxVal, { r: 254, g: 142, b: 37 }, false);
    }

    // Draw court lines
    const courtXMin = -courtWidth / 2;
    const courtXMax = courtWidth / 2;
    const courtYMin = -courtLength / 2;
    const courtYMax = courtLength / 2;

    ctx.strokeStyle = '#42B6B1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(
      toCanvasX(courtXMin),
      toCanvasY(courtYMax),
      (courtXMax - courtXMin) * scaleX,
      (courtYMax - courtYMin) * scaleY
    );
    ctx.stroke();

    // Draw net
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(courtXMin), toCanvasY(0));
    ctx.lineTo(toCanvasX(courtXMax), toCanvasY(0));
    ctx.stroke();

  }, [data, selectedPlayer]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <div 
        ref={containerRef}
        className="relative w-full"
        style={{ paddingBottom: '150%' }} // 23.77 / 8.23 * 50% ≈ 144% (adding some margin)
      >
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

