import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Flag, Clock } from 'lucide-react';
import { Recommendation, RecommendationPriority } from '@/types/recommendation.types';

const priorityColors: Record<RecommendationPriority, string> = {
  CRITICAL: 'destructive',
  HIGH: 'warning',
  MEDIUM: 'secondary',
  LOW: 'default'
} as const;

interface RecommendationCardProps {
  recommendation: Recommendation;
  onView: (id: string) => void;
  onDismiss: (id: string) => void;
  onComplete: (id: string) => void;
  onFeedback: (id: string, rating: number) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onView,
  onDismiss,
  onComplete,
  onFeedback
}) => {
  const {
    id,
    type,
    priority,
    status,
    title,
    description,
    expiresAt,
    userRating
  } = recommendation;

  React.useEffect(() => {
    if (status === 'ACTIVE') {
      onView(id);
    }
  }, []);

  return (
    <Card className={`mb-4 relative ${status === 'DISMISSED' ? 'opacity-70' : ''}`}>
      <div className={`absolute left-0 top-0 w-1 h-full bg-${priorityColors[priority]}`} />
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">
            {type.replace(/_/g, ' ')}
          </Badge>
          {status === 'ACTIVE' && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onComplete(id)}
                title="Đánh dấu hoàn thành"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDismiss(id)}
                title="Bỏ qua"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flag className={`h-4 w-4 text-${priorityColors[priority]}`} />
            <span className="text-sm text-muted-foreground">{priority}</span>
          </div>

          {expiresAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Hết hạn: {new Date(expiresAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}
        </div>

        {status === 'COMPLETED' && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Đánh giá mức độ hữu ích:
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(id, star)}
                  className={star <= (userRating || 0) ? 'text-yellow-500' : 'text-gray-300'}
                >
                  ★
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard; 