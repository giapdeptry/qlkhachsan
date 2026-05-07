import { useEffect, useState } from 'react';
import { requestGetRoomWatch } from '../../../config/RoomWatch';

import RoomCardBody from '../../../components/CardBody';

function RoomWatch() {
    const [roomWatch, setRoomWatch] = useState([]);

    useEffect(() => {
        const fetchRoomWatch = async () => {
            const res = await requestGetRoomWatch();
            setRoomWatch(Array.isArray(res.metadata) ? res.metadata.filter((item) => item?.roomId) : []);
        };
        fetchRoomWatch();
    }, []);

    if (roomWatch.length === 0) {
        return (
            <div className="min-h-[300px] flex items-center justify-center text-center text-gray-500">
                <div>
                    <p className="text-lg font-medium mb-2">Bạn chưa theo dõi phòng nào.</p>
                    <p>Hãy duyệt phòng và thêm vào danh sách yêu thích để xem lại sau.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {roomWatch.map((room) => (
                <RoomCardBody key={room._id} room={room.roomId} />
            ))}
        </div>
    );
}

export default RoomWatch;
