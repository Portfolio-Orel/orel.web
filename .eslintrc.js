module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'next',
    'prettier',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/interactive-supports-focus": "off",
    "react/jsx-curly-brace-presence": "off",
    "react/forbid-prop-types": "off",
    " jsx-a11y/no-static-element-interactions": "off",
  },
};
