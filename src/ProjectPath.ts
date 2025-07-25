import * as path from 'path';

const ROOT = process.cwd();

export const ProjectPath = {
  to(...parts: string[]): string { return path.resolve(ROOT, path.join(...parts)); },

  src(...parts: string[]): string { return this.to('src', ...parts); },
  srcWeb(...parts: string[]): string { return this.src('web', ...parts); },
  srcWebCode(...parts: string[]): string { return this.srcWeb('code', ...parts); },
  srcWebPublic(...parts: string[]): string { return this.srcWeb('public', ...parts); },

  web(...parts: string[]): string { return this.to('web', ...parts); },
};
