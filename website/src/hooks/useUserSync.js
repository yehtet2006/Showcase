import { useAuth, useUser } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { syncUser } from "../lib/api";
import { useEffect } from "react";


function useUserSync() {
  const { isSignedIn } = useAuth();
    const { user } = useUser();

    const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({ mutationFn: syncUser });

    useEffect(() => {
        if (isSignedIn && user && !isPending && !isSuccess) {
            syncUserMutation();
        }
    }, [isSignedIn, user, syncUserMutation, isPending, isSuccess])
    return { isSynced: isSuccess };
}

export default useUserSync