import { useCallback } from 'react';
import io from 'socket.io-client';

const BACK_URL = 'http://localhost:3095';
const sockets: { [key: string]: SocketIOClient.Socket } = {};

export default function useSocket(workspace: string): [SocketIOClient.Socket | undefined, () => void] {
  if (!sockets[workspace])
    sockets[workspace] = io.connect(`${BACK_URL}/ws-${workspace}`, {
      transports: ['websocket'],
    });

  const disconnect = useCallback(() => {
    if (workspace && !sockets[workspace]) return;

    sockets[workspace].disconnect();
    delete sockets[workspace];
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];

  return [sockets[workspace], disconnect];
}
