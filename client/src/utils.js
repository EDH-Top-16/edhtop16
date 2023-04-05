

export const insertIntoObject = (obj, keys, val) => {
  if (val === "null") val = undefined
  if(!Array.isArray(keys))
    return {
      ...obj,
      [keys]: val,
    };
  if(keys.length === 1) {
    return {
      ...obj,
      [keys[0]]: val
    }
  }
  if (!obj) obj = {}

  return {
    ...obj,
    [keys[0]]: insertIntoObject(obj[keys[0]], keys.splice(1), val)
  }
  
}

const isObject = v => v && typeof v === 'object';

export const compressObject = (obj, prefix = '') => {
  return Object.entries(obj).reduce((res, cur) => ({
    ...res, 
    ...(!isObject(cur[1]) ? {[`${prefix}${prefix && '__'}${cur[0]}`]: cur[1]} : compressObject(cur[1], `${prefix}${prefix && '__'}${cur[0]}`)) 
  }), {})
}