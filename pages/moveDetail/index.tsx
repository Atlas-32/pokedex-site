import React from "react";
import { useRouter } from "next/router";
import MoveDetailContainer from "../../container/MoveDetail";

export default function MoveDetail() {
  const router = useRouter();
  const { query } = router;

  return <MoveDetailContainer moveId={query?.moveId} />;
}
