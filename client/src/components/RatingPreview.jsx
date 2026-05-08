import { useState, useEffect } from 'react';
import { Star, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { requestGetRatingsByRoomId } from '../config/RatingRequest';

function RatingPreview({ roomId, refreshTrigger = 0 }) {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        fetchRatings();
    }, [roomId, refreshTrigger]);

    const fetchRatings = async () => {
        try {
            setLoading(true);
            const res = await requestGetRatingsByRoomId(roomId);
            const { ratings: ratingsData, averageRating: avg, totalRatings: total } = res.metadata;
            const sortedRatings = [...ratingsData].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setRatings(sortedRatings.slice(0, 3)); // Hiển thị 3 đánh giá mới nhất
            setAverageRating(avg);
            setTotalRatings(total);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-3 h-3 ${
                    index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            {/* Header with Average Rating */}
            <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-800">Đánh giá từ khách</h3>
                    <span className="text-xs text-gray-500">({totalRatings})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">{renderStars(Math.round(averageRating))}</div>
                    <span className="text-sm font-bold text-gray-900">{averageRating}</span>
                    <span className="text-xs text-gray-500">/ 5.0</span>
                </div>
            </div>

            {/* Recent Ratings Preview */}
            {totalRatings > 0 && (
                <>
                    <div className={`px-3 py-2 ${expanded ? '' : 'max-h-36 overflow-hidden'}`}>
                        <div className="space-y-2">
                            {ratings.map((rating, index) => (
                                <div key={index} className="pb-2 border-b last:border-b-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {rating.userId.avatar ? (
                                                    <img
                                                        src={rating.userId.avatar}
                                                        alt={rating.userId.fullName}
                                                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-primary-300 flex items-center justify-center text-white text-xs flex-shrink-0">
                                                        {rating.userId.fullName.charAt(0)}
                                                    </div>
                                                )}
                                                <p className="text-xs font-medium text-gray-900 truncate">
                                                    {rating.userId.fullName}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                {renderStars(rating.rating)}
                                                <span className="text-xs text-gray-600">{rating.rating}/5</span>
                                            </div>
                                            {rating.comment && (
                                                <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                                                    {rating.comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    {totalRatings > 3 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full px-3 py-2 text-xs font-medium text-primary-600 hover:bg-primary-50 flex items-center justify-center gap-1 border-t"
                        >
                            {expanded ? (
                                <>
                                    <ChevronUp className="w-3 h-3" />
                                    Thu gọn
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3 h-3" />
                                    Xem {totalRatings - 3} đánh giá khác
                                </>
                            )}
                        </button>
                    )}
                </>
            )}

            {/* No Ratings */}
            {totalRatings === 0 && (
                <div className="p-3 text-center">
                    <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Chưa có đánh giá nào</p>
                    <p className="text-xs text-gray-500 mt-1">Hãy là người đầu tiên đánh giá!</p>
                </div>
            )}
        </div>
    );
}

export default RatingPreview;
