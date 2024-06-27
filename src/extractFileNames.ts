export const extractFileNames = (input: string): string => input
  .trim()
  .split('\n')
  .map(path => path.split('/').reverse()[0])
  .join('\n');
