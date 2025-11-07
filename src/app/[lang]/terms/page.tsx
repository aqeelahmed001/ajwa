import Link from "next/link"

interface PageProps {
  params: { lang: string }
}

export default function TermsPage({ params }: PageProps) {
  const isJapanese = params.lang === "ja"

  const sections = isJapanese
    ? [
        {
          title: "利用規約の概要",
          description:
            "本規約は、アジュワ株式会社（以下「当社」といいます）が提供するサービスを利用する際の条件を定めるものです。サービスを利用されるお客様（以下「利用者」といいます）は、本規約に同意したものとみなします。",
        },
        {
          title: "サービスの提供",
          description:
            "当社は、機械の査定・売買・輸出入に関する各種サービスを提供します。提供するサービスの内容は、事前の告知なく変更・中断・終了する場合があります。",
        },
        {
          title: "禁止事項",
          description:
            "法令に違反する行為、虚偽の登録情報を提供する行為、当社または第三者の権利を侵害する行為、公序良俗に反する行為を禁止します。違反が認められた場合、当社はサービス利用を停止することができます。",
        },
        {
          title: "免責事項",
          description:
            "当社は、天災地変、通信障害、第三者による不正アクセス等、当社の責に帰すことができない事由により利用者に生じた損害については、一切の責任を負わないものとします。",
        },
        {
          title: "準拠法と裁判管轄",
          description:
            "本規約は日本法に準拠します。本規約またはサービスに関して紛争が生じた場合には、名古屋地方裁判所を第一審の専属的合意管轄裁判所とします。",
        },
      ]
    : [
        {
          title: "Overview",
          description:
            "These Terms and Conditions (the “Terms”) govern the use of services provided by Ajwa Co., LTD (the “Company”). By accessing or using any of our services, you (“the User”) agree to be bound by these Terms.",
        },
        {
          title: "Services",
          description:
            "We provide valuation, purchase, and export/import support for industrial machinery. The scope and availability of services may change, be suspended, or discontinued without prior notice at our discretion.",
        },
        {
          title: "Prohibited Conduct",
          description:
            "Users must refrain from violating any laws, submitting false or misleading information, infringing upon the rights of the Company or third parties, or engaging in behaviour that is unlawful, abusive, or contrary to public morals. We may suspend access if these conditions are breached.",
        },
        {
          title: "Limitation of Liability",
          description:
            "The Company is not liable for losses arising from force majeure events, communication failures, unauthorised access by third parties, or other circumstances beyond our reasonable control.",
        },
        {
          title: "Governing Law",
          description:
            "These Terms are governed by the laws of Japan. Any disputes arising from or relating to these Terms or our services shall be submitted to the exclusive jurisdiction of the Nagoya District Court in the first instance.",
        },
      ]

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
            {isJapanese ? "利用規約" : "Terms & Conditions"}
          </h1>
          <p className="text-slate-600">
            {isJapanese
              ? "本規約は当社サービスをご利用いただく際に適用される基本ルールです。"
              : "These terms outline the conditions for using Ajwa’s services."}
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
              ? "ご不明な点がございましたら、お問い合わせフォームよりご連絡ください。"
              : "If you have any questions about these Terms, please reach out via our contact page."}
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
