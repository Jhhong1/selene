module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/prettier', 'plugin:prettier/recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prettier/prettier': ['error'],
        'generator-star-spacing': 'off',
        //强制使用单引号
        quotes: ['error', 'single'],
        'no-empty': ['off'],
        //强制不使用分号结尾
        semi: ['error', 'never'],
        autoFixOnSave: true,
        formatOnSave: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
