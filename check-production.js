#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Kiểm tra dự án cho production...\n');

// Function to run command
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`📋 Đang chạy: ${command} ${args.join(' ')}`);
    const process = spawn(command, args, { 
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} hoàn thành thành công\n`);
        resolve();
      } else {
        console.log(`❌ ${command} thất bại với mã lỗi ${code}\n`);
        reject(new Error(`${command} failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    // Run ESLint
    console.log('🔧 Bước 1: Kiểm tra ESLint...');
    await runCommand('npx', ['eslint', '.']);
    
    // Run build
    console.log('🏗️ Bước 2: Build dự án...');
    await runCommand('npm', ['run', 'build']);
    
    console.log('🎉 Tất cả kiểm tra hoàn thành thành công!');
    console.log('📦 Dự án đã sẵn sàng cho production!');
    
  } catch (error) {
    console.error('💥 Có lỗi xảy ra:', error.message);
    process.exit(1);
  }
}

main();