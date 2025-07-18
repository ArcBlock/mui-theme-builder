export default {
  common: {
    notifications: '通知',
    nft: 'NFTs',
    setting: '设置',
    storageManagement: 'DID Spaces',
  },
  editor: {
    save: '保存',
    cancel: '取消',
    confirm: '确定',
    reset: '重置',
    copy: '复制',
    copied: '已复制！',
    shuffle: '随机生成',
    lock: '锁定',
    unlock: '解锁',
    undo: '撤销',
    redo: '重做',
    concept: {
      name: '主题名称',
      add: '添加主题',
      rename: '重命名主题',
      duplicateName: '主题名称已存在',
      duplicate: '复制主题',
      delete: '删除主题',
      shuffle: '随机生成主题',
      saveSuccess: '主题保存成功。请刷新页面以应用更改。',
      saveFailed: '保存失败：{message}',
      resetTitle: '重置主题',
      resetConfirm: '确定要重置主题设置吗？这将丢弃所有未保存的更改。',
      resetSuccess: '主题已重置为默认设置。请刷新页面以应用更改。',
    },
    colorSection: {
      title: '颜色',
      shades: '色阶',
      reset: '重置颜色',
      invalidHexColor: '无效的 Hex 颜色值',
      neutral: {
        title: '中性色',
        default: '背景',
        paper: '表面',
        divider: '边框',
        hint: '占位符',
        disabled: '禁用文本',
        secondary: '次要文本',
        primary: '主要文本',
      },
      primary: '主色',
      secondary: '次色',
      success: '成功色',
      error: '错误色',
      info: '信息色',
      warning: '警告色',
      light: '浅色',
      dark: '深色',
      contrastText: '对比文本',
      lightMode: '浅色模式',
      darkMode: '深色模式',
      modeDisable: {
        none: '全部启用',
        dark: '禁用深色',
        light: '禁用浅色',
      },
    },
    typographySection: {
      title: '字体',
      reset: '重置所有字体',
      heading: '标题',
      body: '正文',
      base: '基础',
      activeFont: '当前字体',
      results: '{count} 结果',
      noFontsFound: '没有找到匹配的字体',
      searchFonts: '搜索字体...',
      sansSerif: '无衬线',
      serif: '衬线',
      display: '装饰',
      monospace: '等宽',
      fontSize: '字体大小',
      adjustFontSize: '调整字体大小',
      resetAllSizes: '重置所有大小',
      fontSizeDescriptions: {
        body: '页面正文和界面默认字体',
        h1: '最大标题，例如页面主标题',
        h2: '主要分区标题',
        h3: '次级分区标题',
        h4: '组件内的小标题',
        h5: '较小的标题或标签',
        h6: '最小标题，用于紧凑区域',
        subtitle1: '较大的副标题',
        subtitle2: '较小的副标题或辅助说明',
        overline: '位于内容上方的大写标签',
      },
    },
    stylesSection: {
      title: '样式',
      borderRadius: '圆角',
    },
  },
  samples: {
    title: '示例',
    dashboard: {
      nav1: '仪表盘',
      nav2: 'DID Connect',
      group1: '网站',
      group2: '管理',
      group1_1: '概览',
      group1_2: '成员',
      group1_3: '护照',
      group1_4: '域名',
      group2_1: '操作',
      group2_2: '集成',
      group2_3: '开发者',
      group2_4: '设置',
      content: {
        tabs: {
          overview: '概览',
          blocklets: 'Blocklets',
        },
        overview: {
          blocklets: 'Blocklets',
          running: '运行中',
          members: '成员',
          active: '活跃',
          passports: '通行证',
          domains: '域名',
          customDomain: '自定义域名',
          uptime: '运行时长',
          createdAt: '创建于',
          lastBackup: '上次备份时间',
        },
        basicInfo: {
          title: '基本信息',
          appDid: '应用 DID',
          permanentDid: '永久性 DID',
          owner: '所有者',
          installedAt: '安装时间',
          walletType: '钱包类型',
          serverDid: '服务器 DID',
          serverVersion: '服务器版本',
        },
      },
    },
    website: {
      hero: {
        title: '构建更强大的团队',
        subtitle: '为现代 IT 团队打造的终极协作平台。简化您的工作流程，加强沟通，更快地交付项目。',
        cta: {
          start: '免费开始',
          demo: '观看演示',
        },
      },
      features: {
        title: '为什么选择 TeamSpace',
        subtitle: '为现代开发团队设计的强大功能',
        collaboration: {
          title: '团队协作',
          description: '实时的协作工具，让您的团队保持同步',
        },
        performance: {
          title: '快速性能',
          description: '闪电般的性能，可随您的团队扩展',
        },
        security: {
          title: '企业级安全',
          description: '银行级的安全保护，确保您的敏感数据安全',
        },
        access: {
          title: '全球访问',
          description: '从世界任何地方访问您的工作区',
        },
      },
      finalCta: {
        title: '准备好改变您的团队了吗？',
        subtitle: '加入数千个已经在使用 TeamSpace 构建更好产品的团队。',
        cta: '开始免费试用',
      },
    },
  },
};
