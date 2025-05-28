import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Recommendation } from '@/types/recommendation.types';
import RecommendationCard from './RecommendationCard';
import recommendationService from '@/services/recommendation.service';

interface RecommendationListProps {
  filter?: 'active' | 'completed' | 'dismissed';
}

const RecommendationList: React.FC<RecommendationListProps> = ({ filter = 'active' }) => {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'completed') {
        response = await recommendationService.getRecommendationsByStatus('COMPLETED');
      } else if (filter === 'dismissed') {
        response = await recommendationService.getRecommendationsByStatus('DISMISSED');
      } else {
        response = await recommendationService.getRecommendationsByStatus('ACTIVE');
      }

      if (response.success) {
        setRecommendations(response.data || []);
      } else {
        setError(response.message || 'Không thể tải gợi ý');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải gợi ý');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecommendations();
  }, [filter]);

  const handleView = async (id: string) => {
    try {
      await recommendationService.markAsViewed(id);
    } catch (err) {
      console.error('Error marking recommendation as viewed:', err);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      const response = await recommendationService.dismissRecommendation(id);
      if (response.success) {
        setRecommendations(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const response = await recommendationService.markAsCompleted(id);
      if (response.success) {
        setRecommendations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: 'COMPLETED' } : r))
        );
      }
    } catch (err) {
      console.error('Error completing recommendation:', err);
    }
  };

  const handleFeedback = async (id: string, rating: number) => {
    try {
      await recommendationService.submitFeedback(id, {
        feedback: '',
        rating
      });
      setRecommendations(prev =>
        prev.map(r => (r.id === id ? { ...r, userRating: rating } : r))
      );
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Progress value={100} className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Không có gợi ý nào {filter === 'completed' ? 'đã hoàn thành' : filter === 'dismissed' ? 'đã bỏ qua' : 'đang hoạt động'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map(recommendation => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onView={handleView}
          onDismiss={handleDismiss}
          onComplete={handleComplete}
          onFeedback={handleFeedback}
        />
      ))}
    </div>
  );
};

export default RecommendationList; 