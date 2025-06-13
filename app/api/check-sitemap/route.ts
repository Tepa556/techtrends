import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://techtrends.app' 
      : 'http://localhost:3000';

    // Проверяем доступность sitemap
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: 'Sitemap недоступен',
        status: response.status,
        url: sitemapUrl
      }, { status: 500 });
    }

    const content = await response.text();
    
    // Базовая проверка XML структуры
    const isValidXML = content.includes('<?xml') && 
                       content.includes('<urlset') && 
                       content.includes('</urlset>');

    // Подсчитываем количество URL
    const urlCount = (content.match(/<url>/g) || []).length;

    return NextResponse.json({
      success: true,
      message: 'Sitemap доступен и корректен',
      url: sitemapUrl,
      urlCount,
      isValidXML,
      sizeBytes: content.length,
      lastChecked: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Ошибка при проверке sitemap',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
} 