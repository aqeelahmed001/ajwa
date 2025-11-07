import Link from "next/link"

interface PageProps {
  params: { lang: string }
}

export default function SitemapPage({ params }: PageProps) {
  const isJapanese = params.lang === "ja"

  const sections = [
    {
      title: isJapanese ? "会社情報" : "Company",
      links: [
        { label: isJapanese ? "ホーム" : "Home", href: `/${params.lang}` },
        { label: isJapanese ? "会社概要" : "About", href: `/${params.lang}/about` },
        { label: isJapanese ? "サービス" : "Services", href: `/${params.lang}/services` },
        { label: isJapanese ? "お問い合わせ" : "Contact", href: `/${params.lang}/contact` },
      ],
    },
    {
      title: isJapanese ? "取引サポート" : "Trading Support",
      links: [
        { label: isJapanese ? "機械一覧" : "Machinery", href: `/${params.lang}/machinery` },
        { label: isJapanese ? "査定フォーム" : "Sell Your Machine", href: `/${params.lang}/contact?tab=sell` },
        { label: isJapanese ? "FAQ" : "FAQ", href: `/${params.lang}/faq` },
      ],
    },
    {
      title: isJapanese ? "ポリシー" : "Policies",
      links: [
        { label: isJapanese ? "プライバシーポリシー" : "Privacy Policy", href: `/${params.lang}/privacy` },
        { label: isJapanese ? "利用規約" : "Terms & Conditions", href: `/${params.lang}/terms` },
      ],
    },
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
            {isJapanese ? "サイトマップ" : "Site Map"}
          </h1>
          <p className="text-slate-600">
            {isJapanese
              ? "アジュワの主要ページに簡単にアクセスできる一覧です。"
              : "Quick access to key areas of Ajwa’s website."}
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <footer className="text-center bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <p className="text-slate-600">
            {isJapanese
              ? "その他のページについてご不明点がございましたら、お気軽にお問い合わせください。"
              : "If you cannot find a specific page, feel free to contact us for assistance."}
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
