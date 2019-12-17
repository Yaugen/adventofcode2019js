let input = [
  "L,8,R,12,R,12,R,10,R,10,R,12,R,10",
  "L,8,R,12,R,12,R,10,R,10,R,12,R,10",
  "L,10,R,10,L,6,L,10,R,10,L,6,R,10,R,12,R,10",
  "L,8,R,12,R,12,R,10,R,10,R,12,R,10,L,10,R,10,L,6"
].join(",");
//.split(",");

const findPossiblePattern = (input, maxLength) => {
  for (let i = input.length - 1; i >= 0; i--) {
    const possiblePattern = input.slice(0, i);
    const rest = input.slice(i);
    if (possiblePattern.length <= maxLength && rest.includes(possiblePattern)) {
      return possiblePattern
        .split(",")
        .filter(Boolean)
        .join(",");
    }
  }
  return false;
};

const findPatterns = input => {
  const originalString = input.slice();
  let maxLength = originalString.length;
  let patterns = [];
  let curString = originalString.slice(0);
  while (curString.length) {
    const pattern = findPossiblePattern(curString, maxLength);
    if (pattern) {
      curString = curString
        .replace(new RegExp(pattern, "g"), "")
        .split(",")
        .filter(Boolean)
        .join(",");
      patterns.push(pattern);
    } else {
      curString = originalString;
      maxLength = Math.max(...patterns.map(i => i.length)) - 1;
      patterns = [];
    }
    console.log(pattern);
  }
};

findPatterns(input);
