import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RecommendationStats as Stats } from '@/types/recommendation.types';
import recommendationService from '@/services/recommendation.service';

const RecommendationStats: React.FC = () => {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await recommendationService.getRecommendationStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching recommendation stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-4">
        <Progress value={100} className="w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê gợi ý</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Tổng quan */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Tổng quan
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Tổng số: {stats.total}</Badge>
              <Badge variant="default">Đang hoạt động: {stats.active}</Badge>
              <Badge variant="default">Đã hoàn thành: {stats.completed}</Badge>
              <Badge variant="destructive">Đã bỏ qua: {stats.dismissed}</Badge>
            </div>
          </div>

          {/* Theo mức độ ưu tiên */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Theo mức độ ưu tiên
            </h4>
            {stats.byPriority.map(({ priority, count }) => (
              <div key={priority} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{priority}</span>
                  <span className="text-sm">{count}</span>
                </div>
                <Progress
                  value={(count / stats.total) * 100}
                  className={`h-2 ${
                    priority === 'CRITICAL'
                      ? 'bg-destructive'
                      : priority === 'HIGH'
                      ? 'bg-warning'
                      : priority === 'MEDIUM'
                      ? 'bg-secondary'
                      : 'bg-primary'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Theo loại */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Theo loại
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.byType.map(({ type, count }) => (
                <Badge key={type} variant="outline">
                  {type.replace(/_/g, ' ')}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationStats; 