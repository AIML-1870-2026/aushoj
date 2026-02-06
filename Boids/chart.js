class LiveChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.maxDataPoints = 200;
        this.data = [];
        this.metric = 'avgNeighbors';
    }

    setMetric(metric) {
        this.metric = metric;
        this.data = [];
    }

    pushValue(instrumentation) {
        let value;
        switch (this.metric) {
            case 'avgNeighbors':
                value = instrumentation.avgNeighbors;
                break;
            case 'speedVariance':
                value = instrumentation.speedVariance;
                break;
            case 'compactness':
                value = instrumentation.compactness;
                break;
            default:
                value = 0;
        }

        this.data.push(value);
        if (this.data.length > this.maxDataPoints) {
            this.data.shift();
        }
    }

    draw() {
        const theme = getTheme();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pad = { top: 18, right: 10, bottom: 20, left: 45 };

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = theme.glow ? '#050510' : (currentTheme === 'nature' ? '#e8e0c8' : '#12122a');
        ctx.fillRect(0, 0, w, h);

        if (this.data.length < 2) {
            ctx.fillStyle = theme.chartText;
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Collecting data...', w / 2, h / 2);
            return;
        }

        // Compute range
        let min = Infinity, max = -Infinity;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] < min) min = this.data[i];
            if (this.data[i] > max) max = this.data[i];
        }
        if (min === max) { min -= 1; max += 1; }
        const range = max - min;
        const yPad = range * 0.1;
        min -= yPad;
        max += yPad;

        const plotW = w - pad.left - pad.right;
        const plotH = h - pad.top - pad.bottom;

        // Grid lines
        ctx.strokeStyle = theme.chartGrid;
        ctx.lineWidth = 0.5;
        const gridLines = 4;
        for (let i = 0; i <= gridLines; i++) {
            const y = pad.top + (plotH / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(w - pad.right, y);
            ctx.stroke();
        }

        // Y-axis labels
        ctx.fillStyle = theme.chartText;
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= gridLines; i++) {
            const val = max - ((max - min) / gridLines) * i;
            const y = pad.top + (plotH / gridLines) * i;
            ctx.fillText(val.toFixed(1), pad.left - 4, y + 3);
        }

        // Title
        ctx.fillStyle = theme.chartText;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        const labels = {
            avgNeighbors: 'Avg Neighbors',
            speedVariance: 'Speed Variance',
            compactness: 'Flock Compactness'
        };
        ctx.fillText(labels[this.metric] || this.metric, pad.left, pad.top - 6);

        // Data line
        ctx.beginPath();
        for (let i = 0; i < this.data.length; i++) {
            const x = pad.left + (i / (this.maxDataPoints - 1)) * plotW;
            const y = pad.top + plotH - ((this.data[i] - min) / (max - min)) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = theme.chartLine;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fill under line
        const lastX = pad.left + ((this.data.length - 1) / (this.maxDataPoints - 1)) * plotW;
        ctx.lineTo(lastX, pad.top + plotH);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.closePath();
        ctx.fillStyle = theme.chartFill;
        ctx.fill();
    }
}
