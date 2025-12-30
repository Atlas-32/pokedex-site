import React from "react";
import { useRouter } from "next/router";
import SpeciesLearnsetContainer from "../../container/SpeciesLearnset";

export default function SpeciesLearnset() {
  const router = useRouter();
  const { query } = router;

  return <SpeciesLearnsetContainer speciesId={query.speciesId} />;
}
