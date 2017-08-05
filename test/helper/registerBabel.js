const hook = require('css-modules-require-hook');
hook({
  extensions: ['.scss'],
  preprocessCss: data => {
    return data;
  }
});
require('babel-core/register');
