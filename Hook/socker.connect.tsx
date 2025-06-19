import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/Config/env'
export const socket = io(SOCKET_URL);
