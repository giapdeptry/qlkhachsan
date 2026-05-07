#!/usr/bin/env node

/**
 * Test script for chatbot function
 * Run: node test-chatbot.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Mock models before importing chatbot
const mockRoomData = [
    {
        _id: { toString: () => 'room1' },
        roomName: 'Phòng Deluxe',
        roomType: 'Deluxe',
        pricePerNight: 500000,
        discount: 10,
        maxAdults: 2,
        maxChildren: 1,
        amenities: ['WiFi', 'TV', 'Mini Bar'],
        floor: 3,
    },
    {
        _id: { toString: () => 'room2' },
        roomName: 'Phòng Standard',
        roomType: 'Standard',
        pricePerNight: 300000,
        discount: 0,
        maxAdults: 2,
        maxChildren: 0,
        amenities: ['WiFi', 'TV'],
        floor: 1,
    },
];

// Mock mongoose models
require.cache[require.resolve('./src/models/room.model')] = {
    exports: {
        find: async () => mockRoomData,
    },
};

require.cache[require.resolve('./src/models/payment.model')] = {
    exports: {
        find: async () => [],
    },
};

const { askHotelAssistant } = require('./src/utils/chatbot');

async function testChatbot() {
    console.log('🤖 Testing Chatbot...\n');

    try {
        console.log('📝 Test 1: Basic question');
        const response1 = await askHotelAssistant('Có phòng nào rẻ nhất không?');
        console.log('✅ Response:', response1.substring(0, 100) + '...\n');

        console.log('📝 Test 2: Another question');
        const response2 = await askHotelAssistant('Tôi muốn một phòng cho 4 người');
        console.log('✅ Response:', response2.substring(0, 100) + '...\n');

        console.log('✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testChatbot();
