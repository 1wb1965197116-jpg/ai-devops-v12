import React, { useState } from "react";

export default function Dashboard() {
  const [env, setEnv] = useState("");

  const deploy = async () => {
    await fetch("/deploy/vercel", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        projectId: "YOUR_ID",
        env: parseEnv(env)
      })
    });
  };

  const parseEnv = (text) => {
    let obj = {};
    text.split("\n").forEach(line => {
      const [k,v] = line.split("=");
      if (k && v) obj[k.trim()] = v.trim();
    });
    return obj;
  };

  return (
    <div>
      <h2>ENV Dashboard</h2>

      <textarea
        value={env}
        onChange={e => setEnv(e.target.value)}
        style={{width:"100%",height:"150px"}}
      />

      <button onClick={deploy}>Deploy → Vercel</button>
    </div>
  );
}
