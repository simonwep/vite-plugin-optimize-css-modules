const DEFAULT_DICTIONARY = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const createCounter = (dictionary: string = DEFAULT_DICTIONARY) => {
  const sequence: string[] = [dictionary[0]];

  return () => {
    const str = sequence.join('');

    let carry = 0;
    for (let i = 0; i < sequence.length; i++) {
      const index = dictionary.indexOf(sequence[i]) + carry + 1;

      if (index < dictionary.length) {
        sequence[i] = dictionary[index];
        carry = 0;
        break;
      } else {
        sequence[i] = dictionary[0];
        carry = 1;
      }
    }

    if (carry) sequence.push(dictionary[0]);
    return str;
  };
};
