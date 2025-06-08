import { useEffect } from "react";

interface UseRoomConnectionProps {
  draftId: string;
  enterPresenceRoom: (roomId: string) => void;
  leavePresenceRoom: () => void;
  enterRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

export const useRoomConnection = ({
  draftId,
  enterPresenceRoom,
  leavePresenceRoom,
  enterRoom,
  leaveRoom,
}: UseRoomConnectionProps) => {

    
  useEffect(() => {
    enterPresenceRoom("presence/" + draftId);
    enterRoom("storage/" + draftId);
    return () => {
      leaveRoom();
      leavePresenceRoom();
    };
  }, [enterRoom, leaveRoom, enterPresenceRoom, leavePresenceRoom, draftId]);
};
