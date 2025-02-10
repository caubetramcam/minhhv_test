export const splitCdnUrl = (url: string) => {
    if (!url) return '';
    return url.indexOf(process.env['URL_FILE_CDN']) != -1
      ? url.split(`${process.env['URL_FILE_CDN']}/`)[1]
      : url;
  };
  
  export function getCdn<T>(value: T = null, key: string = null): T {
    const S3Url = process.env['URL_FILE_CDN'];
    if (value) {
      if (Array.isArray(value)) {
        return value?.map((p) => {
          if (typeof p == 'string') {
            return p ? S3Url + '/' + p : null;
          } else if (typeof p == 'object') {
            return {
              ...p,
              [key]: p[key] ? S3Url + '/' + p[key] : null,
            };
          }
        }) as T;
      } else if (typeof value == 'object') {
        return (S3Url + '/' + value[key]) as T;
      } else if (typeof value == 'string') {
        return (S3Url + '/' + value) as T;
      }
    }
    return null;
  }