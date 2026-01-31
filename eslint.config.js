import pluginJs from '@eslint/js'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  {
    ...pluginJs.configs.recommended,
    // 忽略特定文件和目录
    ignores: ['**/.*', 'dist/**/*', 'public/*'],
    // 定义全局变量
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    // 插件配置
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules
    }
  },
  // 自定义rules规则
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-self-compare': 'error', // 禁止自身比较
      'no-unused-vars': 'off', // 禁止出现未使用过的变量
      'no-empty': 'error', // 块语句中的内容不能为空
      'no-lone-blocks': 'error', // 禁止不必要的嵌套块
      'no-irregular-whitespace': 'error', // 禁止在字符串和注释之外不规则的空白
      'no-return-assign': 'error', // 禁止在return语句中使用赋值语句
      'no-inner-declarations': 'error', // 禁止在嵌套的块中出现变量声明或 function 声明
      'no-duplicate-case': 'error', // 禁止出现重复的 case 标签
      'no-extra-parens': 'off', // 禁止不必要的括号
      'no-func-assign': 'error', // 禁止对 function 声明重新赋值
      'no-unreachable': 'error', // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
      curly: 'error', // 强制所有控制语句使用一致的括号风格
      eqeqeq: 'error', // 要求使用 === 和 !==
      'no-else-return': 'error', // 禁止 if 语句中 return 语句之后有 else 块
      'no-empty-function': 'error', // 禁止出现空函数
      'no-multi-spaces': 'error', // 禁止使用多个空格
      'no-redeclare': 'error', // 禁止多次声明同一变量
      // "no-return-await": "error", // 禁用不必要的 return await
      'no-self-assign': 'error', // 禁止自我赋值
      'no-useless-catch': 'error', // 禁止不必要的 catch 子句
      'no-useless-return': 'error', // 禁止多余的 return 语句
      'no-shadow': 'off', // 禁止变量声明与外层作用域的变量同名
      'no-delete-var': 'off', // 允许 delete 变量
      'array-bracket-spacing': 'error', // 强制数组方括号中使用一致的空格
      'brace-style': 'error', // 强制在代码块中使用一致的大括号风格
      // camelcase: 'error', // 强制使用骆驼拼写法命名约定
      indent: 'off', // 强制使用一致的缩进
      'max-nested-callbacks': ['error', 3], // 强制回调函数最大嵌套深度
      'no-lonely-if': 'error', // 禁止 if 作为唯一的语句出现在 else 语句中
      'no-mixed-spaces-and-tabs': 'error', // 禁止空格和 tab 的混合缩进
      semi: ['error', 'never'], // 禁止出现;
      'space-before-blocks': 'error', // 强制在块之前使用一致的空格
      'space-in-parens': 'error', // 强制在圆括号内使用一致的空格
      'space-infix-ops': 'error', // 要求操作符周围有空格
      'space-unary-ops': 'error', // 强制在一元操作符前后使用一致的空格
      'switch-colon-spacing': 'error', // 强制在 switch 的冒号左右有空格
      'arrow-spacing': 'error', // 强制箭头函数的箭头前后使用一致的空格
      'prefer-const': 'error', // 要求使用const声明那些声明后不再被修改的变量
      'prefer-rest-params': 'error', // 要求使用剩余参数而不是 arguments
      'no-useless-escape': 'error', // 禁用不必要的转义字符
      'no-prototype-builtins': 'error', // 禁止直接使用 Object.prototypes 的内置属性
      'no-fallthrough': 'error', // 禁止 case 语句落空
      'no-extra-boolean-cast': 'error', // 禁止不必要的布尔转换
      'no-case-declarations': 'error', // 不允许在 case 子句中使用词法声明
      // 禁止多个空行
      'no-multiple-empty-lines': [
        2,
        {
          max: 1
        }
      ],
      // 空格注释强制在注释中的' // '或' /* '后面有一致的空格
      'spaced-comment': [
        2,
        'always',
        {
          markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
        }
      ]
    }
  },
  // 忽略文件
  {
    ignores: [
      '**/dist',
      '.vscode',
      '.idea',
      '.d.ts',
      '*.sh',
      '**/node_modules',
      '**/docs/assets/**',
      '*.md',
      '*.woff',
      '*.woff2',
      '*.eot',
      '*.ttf',
      '*.icon',
      '*.html'
    ]
  }
]
