const rules = require('./webpack.rules');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs-extra');
const ffmpegStatic = require('ffmpeg-static');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: ffmpegStatic,
          to: path.resolve(__dirname, '.webpack', 'main', 'ffmpeg'),
          transform: async (content, absoluteFrom) => {
            // 保留文件权限
            await fs.chmod(absoluteFrom, '777');
            return content;
          },
        },
      ],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tapPromise('SetFFmpegPermission', async () => {
          const ffmpegPath = path.resolve(__dirname, '.webpack/main/ffmpeg', path.basename(ffmpegStatic));
          await fs.chmod(ffmpegPath, 0o755);
        });
      },
    },
  ],
};
