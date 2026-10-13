/**
 * ARQUIVO GERADO a partir de apps/web/assets/js/confetti.js - não edite à mão.
 * Regenere com: npm run sync:content
 */

// ==========================================
// MOTOR DE CONFETES & PARTÍCULAS NEON — Nex_TI
// ==========================================

const ConfettiEngine = (() => {
    let canvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;

    function initCanvas() {
        if (canvas) return;
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const colors = [
        '#00e6e6', // Cyan
        '#8a2be2', // Purple
        '#00ff88', // Green
        '#ffd700', // Gold
        '#2f81f7'  // Blue
    ];

    function createParticle(x, y) {
        return {
            x: x !== undefined ? x : Math.random() * canvas.width,
            y: y !== undefined ? y : -10,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 4 + 3,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        };
    }

    function update() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravidade
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.005;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();

            if (p.y > canvas.height + 20 || p.opacity <= 0) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            animationId = requestAnimationFrame(update);
        } else {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    return {
        burst: (count = 100) => {
            initCanvas();
            for (let i = 0; i < count; i++) {
                particles.push(createParticle());
            }
            if (!animationId) {
                update();
            }
        },

        celebrate: () => {
            initCanvas();
            // Disparos em sequência
            for (let i = 0; i < 150; i++) {
                particles.push(createParticle());
            }
            setTimeout(() => {
                for (let i = 0; i < 100; i++) {
                    particles.push(createParticle());
                }
            }, 300);
            if (!animationId) {
                update();
            }
        }
    };
})();

if (typeof window !== 'undefined') window.ConfettiEngine = ConfettiEngine;

export { ConfettiEngine };
export default ConfettiEngine;
