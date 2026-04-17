async function subscribe() {
  const res = await fetch("/billing/checkout", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email: "user@email.com" })
  });

  const data = await res.json();

  window.location.href = data.url;
}
