"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/nextjs";

import { useAuth } from "@/app/context/AuthContext";
import type { PlayerData } from "@/util/interfaces";

import { fetchConnections } from "@/components/your-connection/services/connections";
import { deleteConnection } from "@/components/your-connection/services/deleteConnection";

import { toastDeleteFailed, toastDeleteSuccess, toastFetchError, toastServerError } from "@/components/your-connection/utils/toasts";
import { clearSelectedPlayerIfMissing } from "@/components/your-connection/utils/sessionSelectedPlayer";

import { ConnectionEmptyState } from "@/components/your-connection/ConnectionEmptyState";
import { ConnectionCard } from "@/components/your-connection/ConnectionCard";

export default function YourConnection() {
  const { profile } = useAuth();
  const [connections, setConnections] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const title = useMemo(() => (profile?.type === "coach" ? "Your Athletes" : "Your Coaches"), [profile?.type]);
  const listTitle = useMemo(() => (profile?.type === "coach" ? "Athlete List" : "Coaches List"), [profile?.type]);

  const loadConnections = useCallback(async () => {
    const email = profile?.email;
    const profileType = profile?.type;
    if (!email || !profileType) return;

    setIsLoading(true);
    const controller = new AbortController();

    try {
      const { data, error } = await fetchConnections({ email, profileType, signal: controller.signal });
      if (error) toastFetchError();
      setConnections(data);
    } catch (err) {
      toastServerError();
      Sentry.captureException(err);
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, [profile?.email, profile?.type]);

  useEffect(() => {
    void loadConnections();
  }, [loadConnections]);

  const handleRemove = useCallback(
    async (id: number) => {
      const email = profile?.email;
      if (!email) return;

      try {
        const updatedData = await deleteConnection({ email, id });
        toastDeleteSuccess();
        clearSelectedPlayerIfMissing(updatedData);
        await loadConnections();
      } catch (err) {
        toastDeleteFailed();
        Sentry.captureException(err);
      }
    },
    [profile?.email, loadConnections]
  );

  return (
    <div className="bg-gray-100 min-h-screen pt-40 px-4">
      <h2 className="text-3xl font-bold text-center pt-8 text-gray-800">{title}</h2>

      <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">{listTitle}</h3>

        <div className="grid grid-cols-2 justify-center items-center sm:grid-cols-3 md:grid-cols-5 gap-y-4">
          {!isLoading && connections.length === 0 ? (
            <ConnectionEmptyState />
          ) : (
            connections.map((p) => <ConnectionCard key={p.id} person={p} onRemove={handleRemove} />)
          )}
        </div>
      </div>
    </div>
  );
}
