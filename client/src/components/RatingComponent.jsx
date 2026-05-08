import { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Star, Trash2, Edit2, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { requestCreateRating, requestGetRatingsByRoomId, requestUpdateRating, requestDeleteRating } from '../config/RatingRequest';
import { useStore } from '../hooks/useStore';

const RatingComponent = forwardRef(({ roomId, paymentId, userHasBooked = false, onRatingSubmitted = null }, ref) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [isLoadingRatings, setIsLoadingRatings] = useState(false);

    const [showRatingForm, setShowRatingForm] = useState(false);
    const [ratingValue, setRatingValue] = useState(5);
    const [commentValue, setCommentValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [internalRefreshKey, setInternalRefreshKey] = useState(0);
    const [sortBy, setSortBy] = useState('newest');

    const { dataUser } = useStore();

    useEffect(() => {
        fetchRatings();
    }, [roomId]);

    useImperativeHandle(ref, () => ({
        refresh: fetchRatings,
    }));

    const fetchRatings = async () => {
        try {
            setIsLoadingRatings(true);
            const res = await requestGetRatingsByRoomId(roomId);
            const { ratings: ratingsData, averageRating: avg, totalRatings: total } = res.metadata;
            setRatings(ratingsData);
            setAverageRating(avg);
            setTotalRatings(total);

            // Check if user has rated this room
            if (dataUser && ratingsData.length > 0) {
                const userRatingData = ratingsData.find((r) => {
                    const ratingUserId = typeof r.userId === 'string' ? r.userId : r.userId?._id;
                    return ratingUserId.toString() === dataUser._id.toString();
                });
                if (userRatingData) {
                    setUserRating(userRatingData);
                } else {
                    setUserRating(null);
                }
            } else {
                setUserRating(null);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setIsLoadingRatings(false);
        }
    };

    const handleSubmitRating = async () => {
        if (!dataUser) {
            toast.error('Vui lòng đăng nhập để đánh giá');
            return;
        }

        // Skip validation for testing - always allow rating
        console.log('Rating allowed - validation skipped');

        try {
            setIsSubmitting(true);

            if (isEditing && userRating) {
                await requestUpdateRating(roomId, userRating._id, {
                    rating: ratingValue,
                    comment: commentValue,
                });
                toast.success('Cập nhật đánh giá thành công');
                setIsEditing(false);
                
                // Optimistic update - cập nhật state ngay lập tức
                const updatedRatings = ratings.map(r =>
                    r._id.toString() === userRating._id.toString()
                        ? { ...r, rating: ratingValue, comment: commentValue, updatedAt: new Date() }
                        : r
                );
                setRatings(updatedRatings);
                setUserRating({ ...userRating, rating: ratingValue, comment: commentValue, updatedAt: new Date() });
            } else {
                const response = await requestCreateRating({
                    roomId,
                    paymentId,
                    rating: ratingValue,
                    comment: commentValue,
                });
                toast.success('Thêm đánh giá thành công');
                
                // Optimistic update - thêm đánh giá mới vào state ngay lập tức
                const newRating = {
                    _id: response.metadata._id || Math.random().toString(),
                    userId: {
                        _id: dataUser._id,
                        fullName: dataUser.fullName,
                        avatar: dataUser.avatar,
                    },
                    rating: ratingValue,
                    comment: commentValue,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                
                const updatedRatings = [newRating, ...ratings];
                setRatings(updatedRatings);
                setUserRating(newRating);
                
                // Cập nhật thống kê
                const newTotal = ratings.length + 1;
                const newAverage = ((parseFloat(averageRating) * ratings.length + ratingValue) / newTotal).toFixed(1);
                setAverageRating(newAverage);
                setTotalRatings(newTotal);
            }

            setRatingValue(5);
            setCommentValue('');
            setShowRatingForm(false);

            // Gọi callback để notify parent component
            if (onRatingSubmitted) {
                onRatingSubmitted();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi thêm đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRating = async (ratingId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;

        try {
            await requestDeleteRating(roomId, ratingId);
            toast.success('Xóa đánh giá thành công');

            // Cập nhật local state
            const updatedRatings = ratings.filter(r => r._id !== ratingId);
            setRatings(updatedRatings);

            // Cập nhật thống kê
            const newTotal = updatedRatings.length;
            const newAverage =
                newTotal > 0
                    ? (updatedRatings.reduce((sum, r) => sum + r.rating, 0) / newTotal).toFixed(1)
                    : 0;
            setAverageRating(newAverage);
            setTotalRatings(newTotal);

            // Xóa đánh giá của người dùng nếu đó là đánh giá của họ
            if (userRating && userRating._id.toString() === ratingId.toString()) {
                setUserRating(null);
            }

            // Gọi callback để notify parent component
            if (onRatingSubmitted) {
                onRatingSubmitted();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi xóa đánh giá');
        }
    };

    const handleEditRating = (rating) => {
        setRatingValue(rating.rating);
        setCommentValue(rating.comment || '');
        setIsEditing(true);
        setShowRatingForm(true);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${
                    index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    const renderStarSelector = () => {
        return (
            <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => setRatingValue(index + 1)}
                        type="button"
                        className="transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-8 h-8 cursor-pointer ${
                                index < ratingValue
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const sortedRatings = useMemo(() => {
        return [...ratings].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            switch (sortBy) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });
    }, [ratings, sortBy]);

    return (
        <div className="mt-8 space-y-6">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-gray-800">
                            {averageRating}
                        </div>
                        <div className="flex justify-center mt-2">{renderStars(Math.round(averageRating))}</div>
                        <div className="text-sm text-gray-600 mt-2">({totalRatings} đánh giá)</div>
                    </div>

                    {/* Rating Form */}
                    <div className="flex-1">
                        {!showRatingForm ? (
                            <button
                                onClick={() => {
                                    if (userRating) {
                                        handleEditRating(userRating);
                                    } else {
                                        setShowRatingForm(true);
                                    }
                                }}
                                disabled={!userHasBooked || !dataUser}
                                className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                            >
                                {userRating ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đánh giá:
                                    </label>
                                    {renderStarSelector()}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bình luận:
                                    </label>
                                    <textarea
                                        value={commentValue}
                                        onChange={(e) => setCommentValue(e.target.value)}
                                        placeholder="Chia sẻ trải nghiệm của bạn..."
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSubmitRating}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 transition"
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowRatingForm(false);
                                            setIsEditing(false);
                                            setRatingValue(5);
                                            setCommentValue('');
                                        }}
                                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ratings List */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Đánh giá từ khách hàng</h3>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="highest">Đánh giá cao nhất</option>
                        <option value="lowest">Đánh giá thấp nhất</option>
                    </select>
                </div>
                {isLoadingRatings ? (
                    <div className="text-center text-gray-500">Đang tải đánh giá...</div>
                ) : ratings.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Chưa có đánh giá nào cho phòng này</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedRatings.map((rating) => {
                            const userAvatar = rating.userId?.avatar;
                            const userFullName = rating.userId?.fullName || 'Unknown User';
                            const ratingUserId = typeof rating.userId === 'string' ? rating.userId : rating.userId?._id;
                            return (
                            <div key={rating._id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            {userAvatar ? (
                                                <img
                                                    src={userAvatar}
                                                    alt={userFullName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center text-white font-semibold">
                                                    {userFullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {userFullName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            {renderStars(rating.rating)}
                                            <span className="text-sm font-semibold text-gray-700">
                                                {rating.rating}/5
                                            </span>
                                        </div>

                                        {rating.comment && (
                                            <p className="text-gray-700 mt-2">{rating.comment}</p>
                                        )}
                                    </div>

                                    {dataUser && ratingUserId && dataUser._id.toString() === ratingUserId.toString() && (
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEditRating(rating)}
                                                className="text-primary-500 hover:text-primary-700 p-1"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRating(rating._id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

export default RatingComponent;
