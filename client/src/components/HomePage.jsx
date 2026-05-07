import { useEffect, useState } from 'react';
import RoomCardBody from './CardBody';
import { requestGetRooms } from '../config/RoomRequest';

function HomePage() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const res = await requestGetRooms();
            setRooms(res.metadata);
        };
        fetchRooms();
    }, []);

    return (
        <div className="px-6 py-10 min-h-screen">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">Danh sách phòng khách sạn</h1>
                <p className="text-gray-600 mt-2">Chọn phòng phù hợp với nhu cầu nghỉ dưỡng của bạn</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map((room) => (
                    <RoomCardBody key={room._id} room={room} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
