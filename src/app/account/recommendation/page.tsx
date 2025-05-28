'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import RecommendationList from '@/components/recommendations/RecommendationList';
import RecommendationStats from '@/components/recommendations/RecommendationStats';
import recommendationService from '@/services/recommendation.service';

export default function RecommendationPage() {
  const [activeTab, setActiveTab] = React.useState('active');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = React.useState(false);

  const handleGenerateRecommendations = async () => {
    try {
      setIsGenerating(true);
      const response = await recommendationService.generateRecommendations();
      if (response.success) {
        // Refresh to active tab
        setActiveTab('active');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
    } finally {
      setIsGenerating(false);
      setShowGenerateDialog(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gợi ý tài chính</h1>
          <Button onClick={() => setShowGenerateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo gợi ý mới
          </Button>
        </div>

        <RecommendationStats />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          <TabsTrigger value="dismissed">Đã bỏ qua</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <RecommendationList filter="active" />
        </TabsContent>
        <TabsContent value="completed">
          <RecommendationList filter="completed" />
        </TabsContent>
        <TabsContent value="dismissed">
          <RecommendationList filter="dismissed" />
        </TabsContent>
      </Tabs>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo gợi ý mới</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Hệ thống sẽ phân tích tình hình tài chính hiện tại của bạn và đưa ra
            những gợi ý phù hợp. Bạn có muốn tiếp tục?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleGenerateRecommendations} disabled={isGenerating}>
              {isGenerating ? 'Đang tạo...' : 'Tạo gợi ý'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 