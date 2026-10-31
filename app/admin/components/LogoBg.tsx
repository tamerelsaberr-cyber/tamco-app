export default function LogoBg() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: -1, opacity: 0.03, pointerEvents: 'none',
      backgroundImage: `url('/tamco-logo.png')`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
      backgroundSize: '40%'
    }} />
  );
}