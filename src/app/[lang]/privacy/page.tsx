import Link from "next/link"

interface PageProps {
  params: { lang: string }
}

export default function PrivacyPolicyPage({ params }: PageProps) {
  const isJapanese = params.lang === "ja"

  const sections = isJapanese
    ? [
        {
          title: "個人情報の取り扱い",
          description:
            "当社は、取得した個人情報を、機械の売買に関するお問い合わせ対応・契約手続き・アフターサービス提供など、正当な目的の範囲内で利用します。",
        },
        {
          title: "個人情報の共有",
          description:
            "お客様の同意がある場合、法令に基づく場合、またはサービス提供に必要な業務委託先へ提供する場合を除き、第三者へ個人情報を提供することはありません。",
        },
        {
          title: "安全管理",
          description:
            "当社は、個人情報への不正アクセス・紛失・改ざん・漏えいを防止するために、適切な管理体制とセキュリティ対策を講じています。",
        },
        {
          title: "お問い合わせ",
          description:
            "個人情報の取り扱いに関するお問い合わせは、下記お問い合わせ窓口よりご連絡ください。",
        },
      ]
    : [
        {
          title: "Use of Personal Information",
          description:
            "We collect and use personal information solely for legitimate business purposes, such as handling machinery inquiries, processing agreements, and delivering after-sales support.",
        },
        {
          title: "Sharing Your Information",
          description:
            "We do not share personal information with third parties unless we have prior consent, are legally required to do so, or must involve a trusted service provider to fulfil our duties.",
        },
        {
          title: "Data Protection",
          description:
            "Appropriate administrative and technical safeguards are in place to prevent unauthorised access, loss, alteration, or disclosure of personal data handled by Ajwa.",
        },
        {
          title: "Contact",
          description:
            "If you have questions about how we manage personal information, please reach out through our contact page below.",
        },
      ]

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
            {isJapanese ? "プライバシーポリシー" : "Privacy Policy"}
          </h1>
          <p className="text-slate-600">
            {isJapanese
              ? "お客様の個人情報を適切に保護し、安心してサービスをご利用いただくための基本方針です。"
              : "Our commitment to safeguarding your personal data and ensuring you can use our services with confidence."}
          </p>
        </header>

        <section className="space-y-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-800">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed">{section.description}</p>
            </div>
          ))}
        </section>

        <footer className="text-center bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <p className="text-slate-600">
            {isJapanese
              ? "個人情報に関するご相談はお問い合わせページよりご連絡ください。"
              : "For any privacy-related requests, please contact us through the link below."}
          </p>
          <div className="mt-4">
            <Link
              href={`/${params.lang}/contact`}
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              {isJapanese ? "お問い合わせ" : "Contact Us"}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
