/**
 * ARQUIVO GERADO a partir de apps/web/assets/js/audio.js - não edite à mão.
 * Regenere com: npm run sync:content
 */

// ==========================================
// MOTOR DE ÁUDIO SINTETIZADO (Web Audio API) — Nex_TI
// ==========================================
// Efeitos sonoros 100% nativos sem necessidade de arquivos externos pesados.

const AudioEngine = (() => {
    let audioCtx = null;
    let isMuted = localStorage.getItem('nexti_audio_muted') === 'true';

    function getContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function createGain(ctx, startVol = 0.15) {
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(startVol, ctx.currentTime);
        gainNode.connect(ctx.destination);
        return gainNode;
    }

    return {
        isMuted: () => isMuted,

        toggleMute: () => {
            isMuted = !isMuted;
            localStorage.setItem('nexti_audio_muted', isMuted);
            return isMuted;
        },

        setMuted: (val) => {
            isMuted = !!val;
            localStorage.setItem('nexti_audio_muted', isMuted);
        },

        // Som de Virar Carta (Woosh sutil)
        playFlip: () => {
            if (isMuted) return;
            const ctx = getContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = createGain(ctx, 0.08);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            osc.connect(gain);
            osc.start();
            osc.stop(ctx.currentTime + 0.13);
        },

        // Som de Acerto / Sucesso (Chime duplo retrô)
        playCorrect: () => {
            if (isMuted) return;
            const ctx = getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = createGain(ctx, 0.12);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880.00, now + 0.08); // A5

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            osc.start();
            osc.stop(now + 0.31);
        },

        // Som de Erro (Buzz grave)
        playError: () => {
            if (isMuted) return;
            const ctx = getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = createGain(ctx, 0.15);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.22);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            osc.start();
            osc.stop(now + 0.23);
        },

        // Fanfarra de Level Up / Conclusão (Arpejo Ascendente)
        playLevelUp: () => {
            if (isMuted) return;
            const ctx = getContext();
            if (!ctx) return;

            const notas = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const now = ctx.currentTime;

            notas.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = createGain(ctx, 0.12);
                const startTime = now + (idx * 0.08);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.12, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

                osc.connect(gain);
                osc.start(startTime);
                osc.stop(startTime + 0.26);
            });
        },

        // Micro-clique de interface
        playClick: () => {
            if (isMuted) return;
            const ctx = getContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = createGain(ctx, 0.04);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);

            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        },

        // Desbloqueio de Módulo ou Conquista
        playUnlock: () => {
            if (isMuted) return;
            const ctx = getContext();
            if (!ctx) return;

            const notas = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
            const now = ctx.currentTime;

            notas.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = createGain(ctx, 0.1);
                const startTime = now + (idx * 0.06);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.1, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

                osc.connect(gain);
                osc.start(startTime);
                osc.stop(startTime + 0.21);
            });
        }
    };
})();

if (typeof window !== 'undefined') window.AudioEngine = AudioEngine;

export { AudioEngine };
export default AudioEngine;
