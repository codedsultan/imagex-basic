/* eslint-disable import/prefer-default-export */
export const sortBy = (sortType = '', reverse?: boolean) => {
  return (a: Record<string, any>, b: Record<string, any>) => {
    const codeA = a[sortType]?.toString().toUpperCase(); // ignore upper and lowercase
    const codeB = b[sortType]?.toString().toUpperCase(); // ignore upper and lowercase
    if (reverse) {
      if (codeA > codeB) {
        return -1;
      }
      if (codeA < codeB) {
        return 1;
      }
    } else {
      if (codeA < codeB) {
        return -1;
      }
      if (codeA > codeB) {
        return 1;
      }
    }

    // names must be equal
    return 0;
  };
};

export const uniqueIdArray = <T extends { [x: string]: any }>(
  arr: Array<T>,
  primaryKey: string
): Array<T> => {
  let itemIds: string[] = [];

  const uniqueOne = arr.filter((item) => {
    const key = primaryKey ? item[primaryKey] : item?.id;
    if (!itemIds.includes(key)) {
      itemIds = [...itemIds, key];
      return true;
    }
    return false;
  });

  return uniqueOne;
};
