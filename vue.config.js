module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "SPL Token UI";
      return args;
    });

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
