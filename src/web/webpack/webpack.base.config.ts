/* eslint-disable */

// TODO: enable eslint

import * as webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin'); // TODO: use import
import { ProjectPath as P } from '../../ProjectPath';

const baseWebpackConfig = (): any => ({
  entry: P.srcWebCode('index.tsx'),

  output: {
    path: P.web(),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  module: {
    rules: [
      {
        // Typescript loader
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: P.srcWebPublic('index.html'),
      title: 'iSuit',
      // favicon: 'assets/images/logo.png',
      // inject: true,
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // fallback: { "url": false },
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});

export default baseWebpackConfig;
