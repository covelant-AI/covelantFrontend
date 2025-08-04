export default function SuccessDisplay({ sessionId }) {
  const handlePortal = async () => {
    const res = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <section>
      <h3>Subscription to starter plan successful!</h3>
      <button onClick={handlePortal}>Manage your billing</button>
    </section>
  );
}
