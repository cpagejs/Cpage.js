module.exports = {
  base: '/cpage/',
  title: 'Cpage.js',
  description: 'Cpage.js docs 文档',
  themeConfig: {
    nav: [
      { text: 'GitHub', link: 'https://github.com/cpagejs/Cpage.js' },
    ],
    sidebar: [
      {
        title: '简介',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          { title: '简介', path: '/简介/简介' }
        ]
      },
      {
        title: '组件', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: 'es5语法', path: '/组件/es5语法' },
          { title: 'es6语法', path: '/组件/es6语法' }
        ]
      },
      {
        title: '属性', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: '属性', path: '/属性/属性' },
        ]
      },
      {
        title: '钩子函数', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: '方法', path: '/方法/方法' },
        ]
      },
      {
        title: '指令', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: '指令', path: '/指令/指令' },
        ]
      },
      {
        title: '组件操作', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: '组件操作', path: '/组件操作/组件操作' },
        ]
      },
      {
        title: 'http', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: 'http', path: '/http/ajax' },
        ]
      },
      {
        title: 'DOM操作', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { title: 'DOM操作', path: '/DOM操作/DOM操作' },
        ]
      },
    ]
  }
};