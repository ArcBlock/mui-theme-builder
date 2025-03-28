import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 每个测试后自动清理
afterEach(() => {
  cleanup();
});

// 全局变量模拟
global.__PATH_PREFIX__ = '';
