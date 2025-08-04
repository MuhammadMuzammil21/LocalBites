import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Calendar } from 'lucide-react';
import { Review } from '../../api/reviewApi';
import { toast } from 'sonner';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

interface ReviewCardProps {
  review: Review;
  onReviewUpdated?: () => void;
  showOwnerResponse?: boolean;
}

const ReviewCard = ({ review, onReviewUpdated, showOwnerResponse = true }: ReviewCardProps) => {
  const { user } = useAuth();
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMarkHelpful = async (helpful: boolean) => {
    try {
      await reviewApi.markHelpful(review._id, helpful);
      toast.success(`Review marked as ${helpful ? 'helpful' : 'not helpful'}`);
      onReviewUpdated?.();
    } catch (error) {
      console.error('Error marking review:', error);
      toast.error('Failed to mark review');
    }
  };

  const handleAddResponse = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setLoading(true);
    try {
      await reviewApi.addOwnerResponse(review._id, responseText);
      toast.success('Response added successfully');
      setShowResponseForm(false);
      setResponseText('');
      onReviewUpdated?.();
    } catch (error) {
      console.error('Error adding response:', error);
      toast.error('Failed to add response');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const isOwner = user?.role === 'ADMIN' || (user?.role === 'OWNER' && user?.restaurant === review.restaurant._id);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {review.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-white font-semibold">{review.user.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-3 h-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {renderStars(review.rating)}
            <span className="text-white font-semibold">{review.rating}.0</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Text */}
        <p className="text-gray-300 leading-relaxed">{review.review}</p>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-gray-400">Food Quality</span>
            <div className="flex items-center gap-1">
              {renderStars(review.foodRating)}
              <span className="text-white">{review.foodRating}.0</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Service</span>
            <div className="flex items-center gap-1">
              {renderStars(review.serviceRating)}
              <span className="text-white">{review.serviceRating}.0</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Delivery</span>
            <div className="flex items-center gap-1">
              {renderStars(review.deliveryRating)}
              <span className="text-white">{review.deliveryRating}.0</span>
            </div>
          </div>
        </div>

        {/* Helpful Buttons */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkHelpful(true)}
              className="text-gray-400 hover:text-green-400 hover:bg-gray-700"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkHelpful(false)}
              className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              Not Helpful
            </Button>
          </div>
          
          {isOwner && showOwnerResponse && !review.ownerResponse && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResponseForm(true)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Respond
            </Button>
          )}
        </div>

        {/* Owner Response */}
        {review.ownerResponse && (
          <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-600 text-white">
                Restaurant Response
              </Badge>
              <span className="text-sm text-gray-400">
                {formatDate(review.ownerResponse.createdAt)}
              </span>
            </div>
            <p className="text-gray-300">{review.ownerResponse.text}</p>
          </div>
        )}

        {/* Response Form */}
        {showResponseForm && (
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h5 className="text-white font-semibold">Add Response</h5>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response to this review..."
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-white placeholder:text-gray-400 min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddResponse}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Adding...' : 'Add Response'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowResponseForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard; 