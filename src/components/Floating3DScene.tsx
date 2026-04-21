type Props = {
  variant?: 'hero' | 'subtle';
  className?: string;
};

export default function Floating3DScene({ variant = 'subtle', className = '' }: Props) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 grid-bg opacity-60" />

      {variant === 'hero' ? (
        <>
          <div
            className="orb orb-accent float-y-slow"
            style={{ width: 520, height: 520, top: '-12%', left: '-12%' }}
          />
          <div
            className="orb orb-violet float-y"
            style={{ width: 420, height: 420, bottom: '-15%', right: '-10%' }}
          />
        </>
      ) : (
        <div
          className="orb orb-accent float-y-slow"
          style={{ width: 420, height: 420, top: '10%', right: '-12%', opacity: 0.18 }}
        />
      )}
    </div>
  );
}
