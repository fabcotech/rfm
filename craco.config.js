const path = require('path');

module.exports = {
    plugins: [
      {
        plugin: require('craco-plugin-scoped-css'),
      },
    ],
    webpack: {
      rules: [
        //...
        {
          test: /\.(png|jp(e*)g|svg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[hash]-[name].[ext]',
              },
            },
          ],
        },
      ],
    },
  }