/**
 * Motor Algorítmico SM-2 para o Nex_TI Mobile (Spaced Repetition)
 */
export function calcularSm2(cardState, quality) {
  let rep = cardState.rep || 0;
  let interval = cardState.interval || 0;
  let ease = cardState.ease || 2.5;

  if (quality >= 3) {
    if (rep === 0) interval = 1;
    else if (rep === 1) interval = 6;
    else interval = Math.round(interval * ease);

    rep += 1;
    ease = ease + (0.1 - (5 - quality) * 0.1);
  } else {
    rep = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    rep,
    interval,
    ease: Math.round(ease * 100) / 100,
    next: nextDate.getTime()
  };
}
