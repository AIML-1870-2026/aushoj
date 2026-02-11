// Web Worker for fractal computation - offloads heavy math from the main thread

self.onmessage = function (e) {
    const { width, height, xMin, xMax, yMin, yMax, cReal, cImag, maxIter, fractalType, taskId } = e.data;

    const pixels = new Uint8ClampedArray(width * height * 4);
    // Store smooth iteration values so the main thread can map colors
    const iterations = new Float64Array(width * height);

    const xScale = (xMax - xMin) / width;
    const yScale = (yMax - yMin) / height;
    const escapeRadius = 4; // |z|^2 > 4 means |z| > 2

    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            let zReal = xMin + px * xScale;
            let zImag = yMin + py * yScale;
            let iter = 0;
            let zr2, zi2;

            if (fractalType === 'burningship') {
                while (iter < maxIter) {
                    const absR = Math.abs(zReal);
                    const absI = Math.abs(zImag);
                    zr2 = absR * absR;
                    zi2 = absI * absI;
                    if (zr2 + zi2 > escapeRadius) break;
                    zImag = 2 * absR * absI + cImag;
                    zReal = zr2 - zi2 + cReal;
                    iter++;
                }
            } else {
                while (iter < maxIter) {
                    zr2 = zReal * zReal;
                    zi2 = zImag * zImag;
                    if (zr2 + zi2 > escapeRadius) break;
                    zImag = 2 * zReal * zImag + cImag;
                    zReal = zr2 - zi2 + cReal;
                    iter++;
                }
            }

            // Smooth iteration count for nicer color gradients
            let smoothIter;
            if (iter < maxIter) {
                // Normalize with smooth coloring
                const log2 = Math.log(2);
                const modulus = Math.sqrt(zr2 + zi2);
                smoothIter = iter + 1 - Math.log(Math.log(modulus)) / log2;
            } else {
                smoothIter = maxIter;
            }

            iterations[py * width + px] = smoothIter;
        }
    }

    self.postMessage({ iterations, width, height, maxIter, taskId }, [iterations.buffer]);
};
