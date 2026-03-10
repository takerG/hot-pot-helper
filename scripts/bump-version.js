#!/usr/bin/env node
// 自动递增版本号脚本
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const versionFile = join(rootDir, 'VERSION');

// 读取当前版本号
const currentVersion = readFileSync(versionFile, 'utf-8').trim();

// 解析版本号
const parts = currentVersion.split('.').map(Number);

// 递增补丁版本号
parts[2] = (parts[2] || 0) + 1;

// 生成新版本号
const newVersion = parts.join('.');

// 写入新版本号
writeFileSync(versionFile, newVersion + '\n');

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
