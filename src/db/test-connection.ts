import { db } from './index';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    // 执行一个简单的查询来测试连接
    await db.execute(sql`SELECT 1`);
    console.log('数据库连接成功！');
  } catch (error) {
    console.error('数据库连接失败：', error);
  }
}

testConnection(); 