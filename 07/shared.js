const permutations = xs => {
  let result = [];

  for (let i = 0; i < xs.length; i += 1) {
    // recursive without i array item
    let rest = permutations(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      result.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        result.push([xs[i]].concat(rest[j]));
      }
    }
  }
  return result;
};

module.exports = { permutations };
