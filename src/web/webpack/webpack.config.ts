import { WebpackMode } from './constants';
import devWebpackConfig from './webpack.dev.config';

const config = (_: any, args: any): any => {
  switch (args.mode) {
    case WebpackMode.DEV:
      return devWebpackConfig();
    // case WebpackMode.PROD:
    //   return labProdWebpackConfig();
    default:
      throw new Error(`Unknown webpack mode: ${args.mode}`);
  }
};

export default config;
