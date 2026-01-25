import Image from 'next/image'

export default function AdminLogo() {
  return (
    <div className="flex items-center gap-4">
      <Image src="/lscs-logo.png" alt="LSCS Logo" width={48} height={48} />
      <span>
        <h1 className="font-semibold text-2xl">LSCS CMS</h1>
        <h4 className="text-sm font-light">40th La Salle Computer Society</h4>
      </span>
    </div>
  )
}
