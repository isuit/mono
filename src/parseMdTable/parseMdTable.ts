import { ParseMdTableOut } from './constants';

interface Opts {
  header?: string[]
  rowReducer?: (row: string[]) => string[]
  colOrder?: number[] // 1-based
  out?: ParseMdTableOut
  outRowSep?: string
}
export { Opts as ParseMdTableOpts };

type TableRows = any[]

type Result = TableRows | { body: TableRows, header?: string[] } | string;

export const parseMdTable = (input: string, opts: Opts = {}): Result => {
  const table = input
    .trim()
    .split('\n')
    .map(line => {
      let row: any = line
        .replace(/^\s*\||\|\s*$/g, '')
        .split('|')
        .map(v => v.trim());

      if (opts.rowReducer) {
        row = opts.rowReducer(row);
      }

      if (opts.colOrder) {
        sortRow(row, opts.colOrder);
      }

      return row;
    });

  tryAddHeader(table, opts);

  return convertTable(table, opts);
};

/*** Private ***/

function tryAddHeader(table, opts: Opts) {
  if (!opts.header) {
    return table;
  }

  const header = opts.header;

  if (table[0].length === header.length) {
    if (opts.colOrder) {
      sortRow(header, opts.colOrder);
    }
    return table.unshift(header);
  }

  throw new Error(`Header size(${header.length}) mismatches table size(${table[0].length})`);
}

function sortRow(row, colOrder) {
  row.sort((a, b) => {
    const
      aPos = row.indexOf(a) + 1,
      aWeight = colOrder.indexOf(aPos),
      bPos = row.indexOf(b) + 1,
      bWeight = colOrder.indexOf(bPos);

    // eslint-disable-next-line no-nested-ternary
    return aWeight === bWeight ? 0 : (aWeight < bWeight ? -1 : 1);
  });
}

function convertTable(table: TableRows, opts: Opts) {
  switch (opts?.out) {
    case ParseMdTableOut.STRUCT:
      return opts.header ? { header: table.shift(), body: table } : { body: table };

    case ParseMdTableOut.CSV:
      return table.map(row => row.join(',')).join('\n');

    /**
     * TODO:
     *  Normally row concat should happen within main loop (see above) to opt for performance.
     *  Though now considered pre-mature optimization.
     */
    case ParseMdTableOut.CUSTOM_SEP:
      return table.map(row => row.join(opts.outRowSep)).join('\n');

    default:
      return table;
  }
}
