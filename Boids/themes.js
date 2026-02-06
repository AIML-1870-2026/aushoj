const Themes = {
    minimal: {
        name: 'Minimal',
        canvasBg: '#1a1a2e',
        boidColor: '#00d9ff',
        boidStroke: null,
        trailColor: '#00d9ff',
        obstacleColor: 'rgba(255, 255, 255, 0.12)',
        obstacleBorder: 'rgba(255, 255, 255, 0.3)',
        gridColor: 'rgba(255, 255, 255, 0.03)',
        chartLine: '#00d9ff',
        chartFill: 'rgba(0, 217, 255, 0.1)',
        chartGrid: '#2a2a4a',
        chartText: '#666',
        glow: false
    },
    neon: {
        name: 'Neon',
        canvasBg: '#000000',
        boidColor: '#00ffff',
        boidStroke: null,
        trailColor: '#ff00ff',
        obstacleColor: 'rgba(255, 0, 255, 0.1)',
        obstacleBorder: 'rgba(255, 0, 255, 0.5)',
        gridColor: 'rgba(100, 0, 150, 0.08)',
        chartLine: '#ff00ff',
        chartFill: 'rgba(255, 0, 255, 0.1)',
        chartGrid: '#1a1a1a',
        chartText: '#555',
        glow: true,
        glowColor: '#00ffff',
        glowBlur: 8
    },
    nature: {
        name: 'Nature',
        canvasBg: '#87CEEB',
        boidColor: '#8B4513',
        boidStroke: '#228B22',
        trailColor: '#228B22',
        obstacleColor: 'rgba(139, 69, 19, 0.15)',
        obstacleBorder: 'rgba(139, 69, 19, 0.5)',
        gridColor: 'rgba(0, 0, 0, 0.04)',
        chartLine: '#228B22',
        chartFill: 'rgba(34, 139, 34, 0.1)',
        chartGrid: '#bfb48f',
        chartText: '#8a8a6d',
        glow: false
    }
};

let currentTheme = 'minimal';

function getTheme() {
    return Themes[currentTheme];
}

function setTheme(themeName) {
    if (!Themes[themeName]) return;
    currentTheme = themeName;

    document.body.className = '';
    if (themeName !== 'minimal') {
        document.body.classList.add('theme-' + themeName);
    }
}
