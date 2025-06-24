#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_FONTS_API_URL = 'https://fonts.google.com/metadata/fonts';
const OUTPUT_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'google-fonts.json');

async function fetchGoogleFonts() {
  try {
    console.log('正在从 Google Fonts API 获取字体数据...');
    
    const response = await fetch(GOOGLE_FONTS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.text();
    console.log('原始数据长度:', rawData.length);
    
    // Google Fonts API 返回的是以 ")]}'" 开头的 JSONP 格式
    const jsonData = rawData.replace(/^\)\]\}'/, '');
    const data = JSON.parse(jsonData);
    
    console.log('解析后的数据结构:', Object.keys(data));
    
    if (!data.familyMetadataList) {
      throw new Error('API 返回的数据中没有 familyMetadataList 字段');
    }
    
    console.log(`获取到 ${data.familyMetadataList.length} 个字体`);
    
    // 处理字体数据，排除手写体，只保留需要的属性，使用更短的属性名
    const processedFonts = data.familyMetadataList
      .filter(font => font.category !== 'Handwriting') // 排除手写体
      .map(font => ({
        f: font.family,        // family -> f
        c: font.category,      // category -> c
        p: font.popularity || 0 // popularity -> p
      }));
    
    // 按 popularity 排序
    const sortedFonts = processedFonts.sort((a, b) => b.p - a.p);
    
    // 创建最终的数据结构，只保留 all 数组
    const finalData = {
      t: sortedFonts.length,  // totalCount -> t
      all: sortedFonts        // allFonts -> all
    };
    
    // 确保输出目录存在
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // 写入压缩的 JSON 文件（无缩进和空格）
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalData), 'utf8');
    
    // 获取文件大小
    const stats = await fs.stat(OUTPUT_FILE);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    // 统计各分类的字体数量
    const categoryStats = sortedFonts.reduce((acc, font) => {
      acc[font.c] = (acc[font.c] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`✅ 字体数据已保存到: ${OUTPUT_FILE}`);
    console.log(`📊 统计信息:`);
    console.log(`   - 总字体数: ${finalData.t} (已排除手写体)`);
    console.log(`   - 文件大小: ${fileSizeKB} KB`);
    console.log(`   - 分类统计:`);
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`     ${category}: ${count} 个字体`);
    });
    
  } catch (error) {
    console.error('❌ 获取字体数据失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

// 运行脚本
fetchGoogleFonts(); 