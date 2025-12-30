import React from "react";
import { useRouter } from "next/router";
import SpeciesDetailContainer from "../../container/SpeciesDetail";

export default function SpeciesDetail() {
  const router = useRouter();
  const { query } = router;

  return <SpeciesDetailContainer speciesId={query?.speciesId} />;
}
