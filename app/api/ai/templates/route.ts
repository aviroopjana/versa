import { NextRequest, NextResponse } from 'next/server';
import { getAvailableTemplates, getTemplatesByCategory, LEGAL_PROMPT_TEMPLATES } from '@/app/lib/promptTemplates';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    if (category) {
      // Return templates by category
      const templates = getTemplatesByCategory(category as any);
      const templateInfo = Object.entries(templates).map(([key, template]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        description: template.description,
        category: template.category,
        examples: template.examples || []
      }));

      return NextResponse.json({
        success: true,
        category,
        templates: templateInfo
      });
    }

    // Return all available templates with metadata
    const availableTemplates = getAvailableTemplates();
    const templateInfo = availableTemplates.map(templateId => {
      const template = LEGAL_PROMPT_TEMPLATES[templateId];
      return {
        id: templateId,
        name: templateId.charAt(0).toUpperCase() + templateId.slice(1),
        description: template.description,
        category: template.category,
        examples: template.examples || []
      };
    });

    // Group by category
    const groupedTemplates = templateInfo.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, typeof templateInfo>);

    return NextResponse.json({
      success: true,
      templates: templateInfo,
      groupedTemplates,
      categories: Object.keys(groupedTemplates)
    });

  } catch (error) {
    console.error('Error fetching transformation templates:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
