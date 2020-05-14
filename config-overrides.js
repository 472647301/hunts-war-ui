const { override, fixBabelImports } = require("customize-cra");

// 打包配置
const addCustomize = () => (config) => {
  if (process.env.NODE_ENV === "production") {
    // 关闭sourceMap
    config.devtool = false;
    // 配置打包后的文件位置
    config.output.publicPath = "./";
  }
  return config;
};

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css",
  }),
  addCustomize()
);
