const capitalizeFirstLetter = (s: string) => {
  if (!s?.length) {
    return "";
  }
  if (s?.length === 1) {
    return s.toLocaleUpperCase();
  }

  return `${s[0].toLocaleUpperCase()}${s.slice(1, s.length)}`;
};

const splitAtCapitalLetter = (s: string) =>
  s.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ");

export { capitalizeFirstLetter, splitAtCapitalLetter };
