  import { capitalCase, sentenceCase } from 'change-case';

const tensNumber = (num?: number) => {
  if (!num) {
    return '00';
  }
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

const getObjectInString = (a: string) => {
  const formattedString = a.substring(a.indexOf('{'), a.lastIndexOf('}') + 1);
  const jsonString = formattedString?.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
  return JSON.parse(jsonString) || {};
};

const getValueId = (
  labels: string | string[],
  dataArr: any[],
  format: 'string' | 'number' | 'string[]' | 'number[]'
) => {
  // pure string
  if (labels && typeof labels === 'string') {
    const id = dataArr.find((d) => d?.name?.toLowerCase() === labels.toLowerCase())?.id || labels;
    if (format === 'string') {
      return id?.toString();
    }
    return Number(id) || id;
  }

  // array
  if (Array.isArray(labels)) {
    const ids = labels.map((l) => {
      const id = dataArr.find((d) => d?.name.toLowerCase() === l.toLowerCase())?.id || l;
      if (format === 'string') {
        return id?.toString();
      }
      return Number(id) || id;
    });

    return ids;
  }

  return labels;
};

export const sentence = (str = '', delimiter?: string) => {
  return sentenceCase(str, { delimiter: delimiter || ' ', suffixCharacters: '!.' });
};

export const titleCase = (str = '') => {
  return str
    .split(' ')
    .map((w) => {
      if (
        [
          'in',
          'of',
          'on',
          'and',
          'for',
          'by',
          'at',
          'or',
          'to',
          'nor',
          'the',
          'not',
          'a',
          'an',
        ].includes(w)
      ) {
        return w.toLowerCase();
      }
      return capitalize(w);
    })
    .join(' ');
};

export const capitalize = (str = '') => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

export const capitalizer = (str = '', delimiter?: string) => {
  return capitalCase(str, { delimiter: delimiter || ' ' });
};

export const firstLetter = (str = '', bool = true) => {
  return bool ? `${str.slice(0, 1)}` : `${str.slice(0)}`;
};

export const rand = (arr: any[]) => {
  const index = +(Math.random() * arr.length).toFixed(0);
  const validIndex = index < arr.length ? index : index === arr.length ? index - 1 : arr.length - 1;
  return arr[validIndex];
};

export function parseJsonString(str: string): object | boolean {
  let result;
  try {
    result = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return result;
}

export function parsedJsonStrToObj(str: string): object | boolean {
  let result;
  try {
    result = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return result;
}

export function uncoatedObjStr(str: string): string {
  return str.replaceAll('{', '').replaceAll('}', '');
}

export function slug(
  title: string,
  separator = '-',
  language = 'en',
  dictionary: Record<string, string> = { '@': 'at' }
) {
  title = language ? ascii(title) : title; // add language support here

  const flip = separator === '-' ? '_' : '-';

  title = title.replace(new RegExp(`[${flip}]+`, 'gu'), separator);

  dictionary = Object.entries(dictionary).reduce((acc: any, [key, value]) => {
    acc[key] = `${separator}${value}${separator}`;
    return acc;
  }, {});

  title = String.prototype.replaceAll.call(
    title,
    new RegExp(`[${Object.keys(dictionary).join('')}]`, 'g'),
    (match) => dictionary[match]
  );

  title = title.replace(new RegExp(`[^${separator}\\p{L}\\p{N}\\s]+`, 'gu'), '');

  title = title.toLowerCase();

  title = title.replace(new RegExp(`[${separator}\\s]+`, 'gu'), separator);

  return title.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
}

export function ascii(title: string) {
  // Here should be the implementation of the ascii function.
  //
  // TODO: Implement the ascii function to consider language.
  let result = '';
  for (let i = 0; i < title.length; i++) {
    result += title.charCodeAt(i) <= 127 ? title[i] : '';
  }
  return result;
}


export default { tensNumber, getObjectInString, getValueId, firstLetter, slug, ascii };

// const stringified = JSON.stringify(formattedString);
