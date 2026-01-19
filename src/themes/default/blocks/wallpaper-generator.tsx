'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2, Wand2 } from 'lucide-react';

import { LazyImage } from '@/shared/blocks/common/lazy-image';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createTime: Date;
}

export function WallpaperGenerator({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入生成图片的描述');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'replicate',
          mediaType: 'image',
          model: 'flux-1.1-pro',
          prompt: prompt.trim(),
          scene: 'text-to-image',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '生成失败');
      }

      // 模拟生成过程，实际项目中应该轮询任务状态
      setTimeout(() => {
        const mockImages: GeneratedImage[] = [
          {
            id: `img-${Date.now()}-1`,
            imageUrl: `https://picsum.photos/400/600?random=${Date.now()}`,
            createTime: new Date(),
          },
          {
            id: `img-${Date.now()}-2`,
            imageUrl: `https://picsum.photos/400/600?random=${Date.now() + 1}`,
            createTime: new Date(),
          },
          {
            id: `img-${Date.now()}-3`,
            imageUrl: `https://picsum.photos/400/600?random=${Date.now() + 2}`,
            createTime: new Date(),
          },
          {
            id: `img-${Date.now()}-4`,
            imageUrl: `https://picsum.photos/400/600?random=${Date.now() + 3}`,
            createTime: new Date(),
          },
        ];

        setGeneratedImages(prev => [...mockImages, ...prev]);
        setIsGenerating(false);
      }, 2000);

    } catch (err: any) {
      setError(err.message || '生成图片时出现错误');
      console.error('Generate error:', err);
      setIsGenerating(false);
    }
  };

  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="container space-y-8 md:space-y-16">
        <ScrollAnimation>
          <div className="mx-auto max-w-4xl text-center text-balance">
            <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {section.title || 'AI 壁纸生成器'}
            </h2>
            <p className="text-muted-foreground mb-6 md:mb-12 lg:mb-16">
              {section.description || '输入描述文字，AI 将为您生成精美的壁纸图片'}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mx-auto max-w-2xl">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="描述您想要的壁纸风格、场景或主题..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isGenerating) {
                      handleGenerate();
                    }
                  }}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      生成
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-destructive text-center text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </ScrollAnimation>

        {/* 当前生成状态 */}
        {isGenerating && (
          <ScrollAnimation delay={0.4}>
            <div className="mx-auto max-w-md">
              <div className="bg-card rounded-lg border p-4 text-center">
                <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  正在生成图片，请稍候...
                </p>
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* 图片列表 */}
        {generatedImages.length > 0 && (
          <ScrollAnimation delay={0.4}>
            <div className="space-y-6">
              <h3 className="text-center text-xl font-semibold">
                生成的壁纸 ({generatedImages.length} 张)
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {generatedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group bg-card relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <LazyImage
                        src={image.imageUrl}
                        alt={`生成的壁纸 ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        width={400}
                        height={600}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-sm text-white">
                        {new Date(image.createTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* 空状态 */}
        {generatedImages.length === 0 && !isGenerating && (
          <ScrollAnimation delay={0.4}>
            <div className="mx-auto max-w-md text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <ImageIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">还没有生成的壁纸</h3>
              <p className="text-muted-foreground text-sm">
                输入描述文字，点击生成按钮开始创建您的个性化壁纸
              </p>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
