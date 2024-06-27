import { extractFileNames } from './extractFileNames';

describe('extractFileNames()', () => {
  it('extracts file names from lines of paths', () => {
    const
      input = `
        /foo/bar/baz.abc
        /xyz/abc/foo.bar
        /def.xyz
      `,
      expected = 'baz.abc\nfoo.bar\ndef.xyz';

    expect(extractFileNames(input)).toBe(expected);
  });
});
