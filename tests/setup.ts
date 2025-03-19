import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// 扩展 Vitest 的期望匹配器
expect.extend(matchers);

// 每个测试后自动清理
afterEach(() => {
  cleanup();
});

// 全局变量模拟
global.__PATH_PREFIX__ = ''; 