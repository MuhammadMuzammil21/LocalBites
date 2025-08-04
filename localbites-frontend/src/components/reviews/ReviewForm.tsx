import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

const reviewSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review too long'),
  rating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  onSubmit: (data: ReviewFormData & { images: string[] }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  restaurantId,
  restaurantName,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue('rating', newRating);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.error('Please upload only image files');
          continue;
        }

        // Convert to base64 for demo (in production, upload to cloud storage)
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          setImages([...images, ...newImages]);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmitForm = (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onSubmit({ ...data, rating, images });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>
          Share your experience at {restaurantName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Summarize your experience"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Review</Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Share the details of your experience..."
              rows={4}
            />
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Upload Button */}
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Add Photos'}
                </p>
              </label>

              {/* Image Previews */}
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || uploading}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 