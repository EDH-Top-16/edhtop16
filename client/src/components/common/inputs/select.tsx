import React from "react";

export default function Select({ children }: any): React.ReactElement {
  return <select className="p-4">{children}</select>;
}
