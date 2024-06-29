import { parseMdTable } from './parseMdTable';
import { ParseMdTableOut } from './constants';

describe('parseMdTable()', () => {
  it('parses simple table', () => {
    const input = `
      | Foo | Bar | Baz |
      | Abc | Xyz | Def |
    `;

    expect(parseMdTable(input)).toEqual([
      ['Foo', 'Bar', 'Baz'],
      ['Abc', 'Xyz', 'Def'],
    ]);
  });

  it('parses simple table with header', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      header = ['One', 'Two', 'Three'];

    expect(parseMdTable(input, { header })).toEqual([
      ['One', 'Two', 'Three'],
      ['Foo', 'Bar', 'Baz'],
      ['Abc', 'Xyz', 'Def'],
    ]);
  });

  it('errors out if header size mismatches table', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      invalidHeaders = [
        [],
        ['One'],
        ['One', 'Two'],
        ['One', 'Two', 'Three', 'Four'],
      ];

    invalidHeaders.forEach(header => expect(() => parseMdTable(input, { header })).toThrow(
      new Error(`Header size(${header.length}) mismatches table size(3)`),
    ));
  });

  it('parses with custom row reducer', () => {
    const
      input = `
        | Foo | Ba;Ar | Baz |
        | Abc | Xy;Yz | Def |
      `,
      rowReducer = row => row.reduce((acc, col, i) => acc.concat(i === 1 ? col.split(';') : col), []);

    expect(parseMdTable(input, { rowReducer })).toEqual([
      ['Foo', 'Ba', 'Ar', 'Baz'],
      ['Abc', 'Xy', 'Yz', 'Def'],
    ]);
  });

  it('parses into struct output', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      out = ParseMdTableOut.STRUCT;

    expect(parseMdTable(input, { out })).toEqual({
      body: [
        ['Foo', 'Bar', 'Baz'],
        ['Abc', 'Xyz', 'Def'],
      ],
    });
  });

  it('parses into struct output with header', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      header = ['One', 'Two', 'Three'],
      out = ParseMdTableOut.STRUCT;

    expect(parseMdTable(input, { header, out })).toEqual({
      header,
      body: [
        ['Foo', 'Bar', 'Baz'],
        ['Abc', 'Xyz', 'Def'],
      ],
    });
  });

  it('parses into CSV', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      out = ParseMdTableOut.CSV;

    expect(parseMdTable(input, { out })).toEqual(`
Foo,Bar,Baz
Abc,Xyz,Def
    `.trim());
  });

  it('parses into CSV with header', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      header = ['One', 'Two', 'Three'],
      out = ParseMdTableOut.CSV;

    expect(parseMdTable(input, { header, out })).toEqual(`
One,Two,Three
Foo,Bar,Baz
Abc,Xyz,Def
    `.trim());
  });

  it('parses into out with custom row separator', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      out = ParseMdTableOut.CUSTOM_SEP,
      outRowSep = ';';

    expect(parseMdTable(input, { out, outRowSep })).toEqual(`
Foo;Bar;Baz
Abc;Xyz;Def
    `.trim());
  });

  it('parses into out with custom row separator and header', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      header = ['One', 'Two', 'Three'],
      out = ParseMdTableOut.CUSTOM_SEP,
      outRowSep = ';';

    expect(parseMdTable(input, { header, out, outRowSep })).toEqual(`
One;Two;Three
Foo;Bar;Baz
Abc;Xyz;Def
    `.trim());
  });

  it('parses with custom column order', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      colOrder = [2, 1, 3];

    expect(parseMdTable(input, { colOrder })).toEqual([
      ['Bar', 'Foo', 'Baz'],
      ['Xyz', 'Abc', 'Def'],
    ]);
  });

  it('parses with custom column order and header', () => {
    const
      input = `
        | Foo | Bar | Baz |
        | Abc | Xyz | Def |
      `,
      header = ['One', 'Two', 'Three'],
      colOrder = [2, 1, 3];

    expect(parseMdTable(input, { header, colOrder })).toEqual([
      ['Two', 'One', 'Three'],
      ['Bar', 'Foo', 'Baz'],
      ['Xyz', 'Abc', 'Def'],
    ]);
  });

  it('parses with custom column order and row reducer', () => {
    const
      input = `
        | Foo | Ba;Ar | Baz |
        | Abc | Xy;Yz | Def |
      `,
      rowReducer = row => row.reduce((acc, col, i) => acc.concat(i === 1 ? col.split(';') : col), []),
      colOrder = [3, 4, 1, 2];

    expect(parseMdTable(input, { rowReducer, colOrder })).toEqual([
      ['Ar', 'Baz', 'Foo', 'Ba'],
      ['Yz', 'Def', 'Abc', 'Xy'],
    ]);
  });

  it('parses with column mapper', () => {
    const
      input = `
        | Foo | BaAr | Baz |
        | Abc | Xyz  | Def |
      `,
      colMapper = (col, i) => {
        switch (i) {
          case 0: return col.toUpperCase();
          case 2: return col.toLowerCase();
          default: return col;
        }
      };

    expect(parseMdTable(input, { colMapper })).toEqual([
      ['FOO', 'BaAr', 'baz'],
      ['ABC', 'Xyz', 'def'],
    ]);
  });

  it('parses with column mapper & custom column order', () => {
    const
      input = `
        | Foo | BaAr | Baz |
        | Abc | Xyz  | Def |
      `,
      colOrder = [2, 1, 3],
      colMapper = (col, i) => {
        switch (i) {
          case 0: return col.toUpperCase();
          case 2: return col.toLowerCase();
          default: return col;
        }
      };

    expect(parseMdTable(input, { colOrder, colMapper })).toEqual([
      ['BAAR', 'Foo', 'baz'],
      ['XYZ', 'Abc', 'def'],
    ]);
  });
});
