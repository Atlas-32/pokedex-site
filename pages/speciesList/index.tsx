import React from "react";
import { useRouter } from "next/router";
import SpeciesListContainer from "../../container/SpeciesList";

export default function SpeciesList() {
  const router = useRouter();
  const { query } = router;

  return (
    <SpeciesListContainer abilityId={query?.abilityId} moveId={query?.moveId} />
  );
}
