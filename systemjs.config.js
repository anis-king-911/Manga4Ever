SystemJS.config({
  baseURL:'https://unpkg.com/',
  defaultExtension: false,
  packages:{
    '/': 'js',
    '/src/scripts': {
      defaultExtension: 'jsx'
    },
    '/src/pages': {
      defaultExtension: 'jsx'
    },
    '/src/components': {
      defaultExtension: 'jsx'
    },
  },
  meta: {
    '*.js': {
      'babelOptions': {
        react: true
      }
    },
    '*.jsx': {
      'babelOptions': {
        react: true
      }
    },/*
    '*.css': {
      loader: 'css'
    },*/
  },
  map: {
    'plugin-babel': 'systemjs-plugin-babel@latest/plugin-babel.js',
    'systemjs-babel-build': 'systemjs-plugin-babel@latest/systemjs-babel-browser.js',
    
    'react': 'react@18/umd/react.production.min.js',
    'react-dom': 'react-dom@18/umd/react-dom.production.min.js',
    'react-router-dom': 'react-router-dom@6.0.0/umd/react-router-dom.production.min.js',
    
    //'css': 'systemjs-plugin-css@latest/css.js',
    
    'firebase-app': 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js',
    'firebase-database': 'https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js'
  },
  transpiler: 'plugin-babel'
});

SystemJS.import('./src/scripts/index')
  .catch(console.error.bind(console));
