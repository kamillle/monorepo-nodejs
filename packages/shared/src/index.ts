// 共有ユーティリティや型定義をここに配置

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

