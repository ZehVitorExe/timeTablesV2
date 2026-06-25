export function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

export function rangesOverlap(startA, endA, startB, endB) {
  const aStart = toDate(startA);
  const aEnd = toDate(endA);
  const bStart = toDate(startB);
  const bEnd = toDate(endB);

  return aStart < bEnd && bStart < aEnd;
}

export function validateDateRange(start, end) {
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    const err = new Error('Datas inválidas.');
    err.status = 400;
    throw err;
  }

  if (startDate >= endDate) {
    const err = new Error('A data/hora de término deve ser posterior ao início.');
    err.status = 400;
    throw err;
  }

  return { startDate, endDate };
}
