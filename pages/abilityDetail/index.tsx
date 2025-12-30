import React from "react";
import { useRouter } from "next/router";
import AbilityDetailContainer from "../../container/AbilityDetail";

export default function AbilityDetail() {
  const router = useRouter();
  const { query } = router;

  return <AbilityDetailContainer abilityId={query?.abilityId} />;
}
