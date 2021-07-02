function countPogs(message) {
  let pogCount = 0;

  const matchingTerms = message.toLowerCase().split(' ');
  let matches = matchingTerms.filter(word => word.includes('pog'));
  matches.forEach(match => {
    pogCount += 1
  });
  return pogCount;
}

module.exports = { countPogs };
