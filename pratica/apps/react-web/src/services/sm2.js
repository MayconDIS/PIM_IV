/**
 * Motor Algorítmico SM-2 (SuperMemo 2 / Anki)
 */
export function calculateSM2(cardState = {}, quality) {
  let rep = cardState.rep || 0;
  let interval = cardState.interval || 0;
  let ease = cardState.ease || 2.5;

  if (quality >= 3) {
    if (rep === 0) {
      interval = 1;
    } else if (rep === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    rep += 1;
    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    rep = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }

  ease = Math.max(1.3, Math.round(ease * 100) / 100);

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    rep,
    interval,
    ease,
    next: nextDate.getTime(),
    lastReviewed: Date.now()
  };
}
