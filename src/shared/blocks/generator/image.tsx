'use client';

import { useEffect, useState } from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconUpload,
  IconX,
} from '@tabler/icons-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';

interface ImageGeneratorProps {
  allowMultipleImages?: boolean;
  maxImages?: number;
}

export function ImageGenerator({
  allowMultipleImages = false,
  maxImages = 8,
}: ImageGeneratorProps = {}) {
  const [activeTab, setActiveTab] = useState('image-to-image');
  const [prompt, setPrompt] = useState('What do you want to create?');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const { user } = useAppContext();

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  // Sample preview images
  const sampleImages = [
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxUpload = allowMultipleImages ? maxImages : 1;
    const newFiles = files.slice(0, maxUpload - uploadedImages.length);

    setUploadedImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index];

    // Revoke the object URL to prevent memory leaks
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }

    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const nextPreview = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % sampleImages.length);
  };

  const prevPreview = () => {
    setCurrentPreviewIndex(
      (prev) => (prev - 1 + sampleImages.length) % sampleImages.length
    );
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      {/* Left Panel */}
      <Card className="bg-background border">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-foreground mb-1 font-semibold">
              Image to Image AI
            </h2>
          </div>

          {/* Mode Selection with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image-to-image">Image to Image</TabsTrigger>
              <TabsTrigger value="text-to-image">Text to Image</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Model Section */}
          <div className="mb-6">
            <h3 className="text-foreground mb-3 font-medium">Model</h3>
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-xs font-bold">
                    G
                  </span>
                </div>
                <div>
                  <div className="text-foreground font-medium">
                    Google Nano Banana
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Ultra-high character consistency
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Try Wan 2.1
              </Button>
            </div>
          </div>

          {/* Images Upload */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-foreground font-medium">Images</h3>
              <span className="text-muted-foreground text-sm">
                {uploadedImages.length}/{allowMultipleImages ? maxImages : 1}
              </span>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div
                className={`mb-4 grid gap-2 ${
                  allowMultipleImages
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {previewUrls.map((url, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="h-20 w-full rounded-lg border object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeImage(index)}
                    >
                      <IconX className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <label className="block">
              <input
                type="file"
                multiple={allowMultipleImages}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={
                  uploadedImages.length >= (allowMultipleImages ? maxImages : 1)
                }
              />
              <div className="border-border hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                <IconUpload className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
                <div className="text-foreground font-medium">Add</div>
              </div>
            </label>
          </div>

          {/* Prompt */}
          <div className="mb-6">
            <h3 className="text-foreground mb-3 font-medium">Prompt</h3>
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-background min-h-[100px] resize-none border"
                placeholder="What do you want to create?"
              />
              <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
                <span>0 / 2000</span>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="text-destructive">🎫 Credits required:</span>
            <span className="text-foreground font-medium">4 Credits</span>
          </div>

          {/* Generate Button */}
          <Button className="bg-background hover:bg-muted text-foreground w-full border">
            ✨ Create
          </Button>
        </CardContent>
      </Card>

      {/* Right Panel - Sample Images */}
      <Card className="bg-background border">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-foreground font-semibold">Sample Image</h2>
          </div>

          {/* Image Carousel */}
          <div className="relative">
            <div className="bg-muted relative mb-4 aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={sampleImages[currentPreviewIndex]}
                alt="Sample"
                className="h-full w-full object-cover"
              />

              {/* Navigation Buttons */}
              <Button
                size="sm"
                variant="secondary"
                className="bg-background/80 hover:bg-background absolute top-1/2 left-2 h-8 w-8 -translate-y-1/2 transform p-0"
                onClick={prevPreview}
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-background/80 hover:bg-background absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform p-0"
                onClick={nextPreview}
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2">
              {sampleImages.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    index === currentPreviewIndex
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                  )}
                  onClick={() => setCurrentPreviewIndex(index)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
