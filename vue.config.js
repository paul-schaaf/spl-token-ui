// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule("fonts")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => {
        options.fallback.options.name = "fonts/[name].[ext]";
        // modify the options...
        return options;
      });
  }
};
