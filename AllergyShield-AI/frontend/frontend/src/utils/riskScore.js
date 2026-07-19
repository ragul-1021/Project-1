export function normalizeRiskScore(rawScore, status) {
  if (rawScore === null || rawScore === undefined || rawScore === '') {
    return status === 'Unsafe' ? 100 : 0;
  }

  const numericScore = Number(rawScore);
  if (!Number.isFinite(numericScore)) {
    return status === 'Unsafe' ? 100 : 0;
  }

  return Math.max(0, Math.min(100, numericScore));
}
