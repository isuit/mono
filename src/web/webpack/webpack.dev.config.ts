import * as webpack from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import { WebpackMode } from './constants';
import webpackBaseConfig from './webpack.base.config';

const devWebpackConfig = (): any => webpackMerge(webpackBaseConfig(), {
  mode: WebpackMode.DEV,

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    open: false,
    port: 9030, // TODO
    historyApiFallback: true,
    allowedHosts: 'all', // Allow any hostname
  },

  watch: true,
});

export default devWebpackConfig;
