import Image from 'next/image'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Image src="/lscs-logo.png" alt="LSCS Logo" width={48} height={48} />
      <span>
        <h1 style={{ fontWeight: '600' }}>LSCS CMS</h1>
        <h4 style={{ fontSize: '14px', fontWeight: '200' }}>40th La Salle Computer Society</h4>
      </span>
    </div>
  )
}
