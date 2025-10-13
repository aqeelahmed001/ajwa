export type Locale = 'en' | 'ja'

interface TranslationData {
  [key: string]: any
}

// Static translation data - in a real app, you might load this from an API
const translations: Record<string, Record<string, TranslationData>> = {
  en: {
    common: {
      navigation: {
        home: "Home",
        about: "About Us",
        services: "Services",
        machinery: "Machinery",
        contact: "Contact",
        language: "Language"
      },
      buttons: {
        contactUs: "Contact Us",
        learnMore: "Learn More",
        viewMachinery: "View Machinery",
        getQuote: "Get Quote",
        submit: "Submit",
        send: "Send Message"
      },
      footer: {
        company: "Company",
        services: "Services",
        contact: "Contact",
        followUs: "Follow Us",
        allRightsReserved: "All rights reserved"
      }
    },
    home: {
      hero: {
        title: "We Buy & Sell Machinery",
        subtitle: "Leading Japan-based machinery export and import company with global reach",
        description: "Ajwa Trading Limited specializes in buying used machinery from Japanese customers and selling high-quality Japanese machinery worldwide.",
        ctaPrimary: "View Machinery",
        ctaSecondary: "Learn More"
      },
      sections: {
        cta: {
          title: "Ready to Trade Machinery?",
          subtitle: "Get in touch with our experts for personalized solutions",
          description: "Whether you're looking to buy quality Japanese machinery or sell your used equipment, we're here to help with professional service and competitive pricing.",
          contactInfo: {
            title: "Contact Information",
            phone: "+81-3-1234-5678",
            email: "info@ajwatrading.com",
            address: "Tokyo, Japan"
          },
          trustBadges: {
            title: "Why Choose Us",
            items: [
              "20+ Years Experience",
              "Global Network",
              "Quality Guaranteed",
              "Fast Service"
            ]
          }
        },
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know about our services",
          items: [
            {
              question: "What types of machinery do you buy and sell?",
              answer: "We deal with a wide range of industrial machinery including manufacturing equipment, construction machinery, agricultural equipment, and specialized industrial tools."
            },
            {
              question: "How do you determine the price for used machinery?",
              answer: "Our pricing is based on market research, equipment condition, age, and current demand. We provide transparent assessments with detailed reports."
            },
            {
              question: "Do you handle international shipping?",
              answer: "Yes, we provide complete international shipping services including documentation, customs clearance, and logistics management."
            },
            {
              question: "What is your typical response time?",
              answer: "We typically respond to inquiries within 24 hours and can complete machinery purchases within 48 hours for qualified equipment."
            },
            {
              question: "Do you provide after-sales support?",
              answer: "Yes, we offer comprehensive after-sales support including installation guidance, maintenance advice, and technical assistance."
            }
          ]
        }
      }
    },
    services: {
      hero: {
        title: "Our Services",
        subtitle: "Ajwa Trading provides comprehensive solutions from machinery procurement to sales and export/import procedures."
      },
      buyingServices: {
        title: "Machinery Purchase Services",
        subtitle: "We provide high-quality Japanese machinery to customers worldwide.",
        services: [
          {
            title: "Machinery Sourcing",
            description: "We source the best machinery from trusted suppliers across Japan.",
            features: ["Quality guaranteed", "Competitive pricing", "Quick sourcing", "Expert selection"]
          },
          {
            title: "International Export",
            description: "We provide safe and efficient export services to countries worldwide.",
            features: ["Documentation handling", "Customs support", "Transport management", "Tracking system"]
          },
          {
            title: "Quality Assurance",
            description: "All machinery undergoes rigorous quality inspection and comes with warranty.",
            features: ["Technical inspection", "Performance testing", "Warranty certificate", "After-sales support"]
          }
        ]
      },
      sellingServices: {
        title: "Machinery Selling Services",
        subtitle: "We offer fair price purchasing of used machinery and quick cash conversion.",
        services: [
          {
            title: "Fair Price Assessment",
            description: "We achieve maximum value through transparent assessment based on market prices.",
            features: ["Market price research", "Transparent assessment", "Detailed reports", "Price negotiation support"]
          },
          {
            title: "Quick Purchase",
            description: "Fast service from assessment to cash conversion, completed within 48 hours.",
            features: ["Cash conversion within 48h", "Documentation handling", "Removal assistance", "Transport support"]
          },
          {
            title: "Procedure Handling",
            description: "We handle all complex selling procedures, minimizing customer burden.",
            features: ["Ownership transfer", "Tax filing support", "Insurance procedures", "Legal documentation"]
          }
        ]
      },
      additionalServices: {
        title: "Additional Services",
        services: [
          {
            title: "Transportation & Logistics",
            description: "We provide safe transportation and storage services for machinery."
          },
          {
            title: "Consulting",
            description: "Professional advice and consulting services for machinery trading."
          },
          {
            title: "Maintenance",
            description: "We provide regular maintenance and repair services for machinery."
          }
        ]
      },
      process: {
        title: "Service Process",
        steps: [
          {
            title: "Inquiry",
            description: "Tell us about your requirements."
          },
          {
            title: "Detailed Consultation",
            description: "Our specialists conduct detailed consultation."
          },
          {
            title: "Proposal & Quote",
            description: "We propose optimal solutions and quotes."
          },
          {
            title: "Contract & Execution",
            description: "After contract signing, we execute services promptly."
          }
        ]
      },
      cta: {
        title: "Want to Learn More About Our Services?",
        text: "Our specialists will propose optimal solutions tailored to your needs.",
        contactButton: "Contact Us",
        viewMachinery: "View Machinery"
      }
    },
    about: {
      hero: {
        title: "About Ajwa Trading Limited",
        subtitle: "Your Trusted Partner in Global Machinery Trade"
      },
      mission: {
        title: "Our Mission",
        description: "To bridge the gap between Japanese machinery suppliers and global buyers, while providing fair and transparent services for those looking to sell their used equipment.",
        vision: "To become the leading machinery trading company connecting Japan with the world."
      },
      keyFacts: {
        title: "Key Facts",
        facts: [
          {
            number: "20+",
            label: "Years Experience",
            description: "Decades of expertise in machinery trading"
          },
          {
            number: "50+",
            label: "Countries Served",
            description: "Global reach across continents"
          },
          {
            number: "1000+",
            label: "Machines Traded",
            description: "Successful transactions completed"
          },
          {
            number: "24h",
            label: "Response Time",
            description: "Quick and reliable service"
          }
        ]
      },
      values: {
        title: "Our Values",
        values: [
          {
            title: "Quality",
            description: "We never compromise on the quality of machinery we trade."
          },
          {
            title: "Trust",
            description: "Building long-term relationships through transparency and reliability."
          },
          {
            title: "Innovation",
            description: "Continuously improving our processes and services."
          },
          {
            title: "Customer Focus",
            description: "Your success is our priority."
          }
        ]
      },
      timeline: {
        title: "Our Journey",
        events: [
          {
            year: "2003",
            title: "Company Founded",
            description: "Started as a small machinery trading company in Tokyo"
          },
          {
            year: "2008",
            title: "International Expansion",
            description: "Began exporting to Southeast Asian markets"
          },
          {
            year: "2015",
            title: "Global Network",
            description: "Established partnerships in 30+ countries"
          },
          {
            year: "2023",
            title: "Digital Transformation",
            description: "Launched comprehensive online platform"
          }
        ]
      },
      cta: {
        title: "Ready to Work With Us?",
        description: "Join thousands of satisfied customers who trust Ajwa Trading for their machinery needs.",
        button: "Get Started"
      }
    },
    inquiry: {
      hero: {
        title: "Send Inquiry",
        subtitle: "Tell us about your machinery needs"
      },
      toggle: {
        sell: "Sell to Us",
        buy: "Buy from Us"
      },
      form: {
        sellTitle: "Sell Your Machinery",
        sellSubtitle: "Get a fair price for your used machinery",
        buyTitle: "Buy Machinery",
        buySubtitle: "Find the perfect machinery for your needs",
        firstName: "First Name",
        lastName: "Last Name",
        companyName: "Company Name (if any)",
        telephone: "Telephone Number",
        email: "Email Address",
        address: "Full Address",
        machineInfo: "Machine Information",
        machineCompany: "Machine Company Name",
        model: "Model",
        year: "Year",
        screwSize: "Screw Size",
        weight: "Weight",
        location: "Location",
        condition: "Condition",
        description: "Additional Description",
        requirements: "Requirements",
        requirementsPlaceholder: "Please describe the machinery you are looking for...",
        selectCondition: "Select condition",
        conditions: {
          excellent: "Excellent",
          good: "Good",
          fair: "Fair",
          poor: "Poor"
        },
        submit: "Send Inquiry",
        submitting: "Sending..."
      },
      validation: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email address"
      },
      success: {
        sellTitle: "Inquiry Sent Successfully!",
        sellMessage: "Our representative will contact you soon to discuss your machinery.",
        buyTitle: "Inquiry Sent Successfully!",
        buyMessage: "Our representative will contact you soon with available options."
      }
    }
  },
  ja: {
    common: {
      navigation: {
        home: "ホーム",
        about: "会社概要",
        services: "サービス",
        machinery: "機械",
        contact: "お問い合わせ",
        language: "言語"
      },
      buttons: {
        contactUs: "お問い合わせ",
        learnMore: "詳しく見る",
        viewMachinery: "機械一覧",
        getQuote: "見積もり依頼",
        submit: "送信",
        send: "メッセージ送信"
      },
      footer: {
        company: "会社",
        services: "サービス",
        contact: "お問い合わせ",
        followUs: "フォローする",
        allRightsReserved: "All rights reserved"
      }
    },
    home: {
      hero: {
        title: "機械の買取・販売",
        subtitle: "グローバルな展開を持つ日本拠点の機械輸出入会社",
        description: "アジュワトレーディングは、日本のお客様からの使用済み機械の買取と、高品質な日本製機械の世界販売を専門としています。",
        ctaPrimary: "機械一覧",
        ctaSecondary: "詳しく見る"
      },
      sections: {
        cta: {
          title: "機械取引の準備はできていますか？",
          subtitle: "専門家にご相談ください",
          description: "高品質な日本製機械の購入や使用済み設備の売却をお考えでしたら、専門的なサービスと競争力のある価格でお手伝いいたします。",
          contactInfo: {
            title: "お問い合わせ先",
            phone: "+81-3-1234-5678",
            email: "info@ajwatrading.com",
            address: "東京都"
          },
          trustBadges: {
            title: "選ばれる理由",
            items: [
              "20年以上の実績",
              "グローバルネットワーク",
              "品質保証",
              "迅速なサービス"
            ]
          }
        },
        faq: {
          title: "よくある質問",
          subtitle: "サービスについて知りたいこと",
          items: [
            {
              question: "どのような種類の機械を買取・販売していますか？",
              answer: "製造設備、建設機械、農業機械、専門的な産業用工具など、幅広い産業機械を取り扱っています。"
            },
            {
              question: "使用済み機械の価格はどのように決定されますか？",
              answer: "市場調査、設備の状態、年数、現在の需要に基づいて価格を決定します。詳細な報告書とともに透明性のある査定を提供します。"
            },
            {
              question: "国際輸送は対応していますか？",
              answer: "はい、書類作成、通関手続き、物流管理を含む完全な国際輸送サービスを提供しています。"
            },
            {
              question: "通常の対応時間はどのくらいですか？",
              answer: "通常24時間以内にお問い合わせに回答し、適格な設備については48時間以内に機械の購入を完了できます。"
            },
            {
              question: "アフターサービスは提供していますか？",
              answer: "はい、設置ガイダンス、メンテナンスアドバイス、技術サポートを含む包括的なアフターサービスを提供しています。"
            }
          ]
        }
      }
    },
    services: {
      hero: {
        title: "サービス",
        subtitle: "アジュワトレーディングは、機械の購入から販売、輸出入手続きまで、包括的なソリューションを提供します。"
      },
      buyingServices: {
        title: "機械購入サービス",
        subtitle: "高品質な日本製機械を世界中のお客様に提供します。",
        services: [
          {
            title: "機械調達",
            description: "日本全国の信頼できるサプライヤーから最適な機械を調達します。",
            features: ["品質保証付き", "適正価格", "迅速な調達", "専門家による選定"]
          },
          {
            title: "国際輸出",
            description: "世界中の国々への安全で効率的な輸出サービスを提供します。",
            features: ["書類手続き代行", "通関サポート", "輸送管理", "追跡システム"]
          },
          {
            title: "品質保証",
            description: "すべての機械は厳格な品質検査を経て、保証付きで提供されます。",
            features: ["技術検査", "性能テスト", "保証書発行", "アフターサポート"]
          }
        ]
      },
      sellingServices: {
        title: "機械売却サービス",
        subtitle: "使用済み機械の適正価格での買取と迅速な現金化を提供します。",
        services: [
          {
            title: "適正価格査定",
            description: "市場価格を基にした透明性のある査定で、最大限の価値を実現します。",
            features: ["市場価格調査", "透明性のある査定", "詳細な報告書", "価格交渉サポート"]
          },
          {
            title: "迅速な買取",
            description: "査定から現金化まで、最短48時間で完了する迅速なサービスです。",
            features: ["48時間以内の現金化", "書類手続き代行", "設備撤去サポート", "搬出サポート"]
          },
          {
            title: "手続き代行",
            description: "複雑な売却手続きをすべて代行し、お客様の負担を最小限に抑えます。",
            features: ["所有権移転手続き", "税務申告サポート", "保険手続き", "法的書類作成"]
          }
        ]
      },
      additionalServices: {
        title: "その他のサービス",
        services: [
          {
            title: "輸送・物流",
            description: "機械の安全な輸送と保管サービスを提供します。"
          },
          {
            title: "コンサルティング",
            description: "機械取引に関する専門的なアドバイスとコンサルティングサービス。"
          },
          {
            title: "メンテナンス",
            description: "機械の定期メンテナンスと修理サービスを提供します。"
          }
        ]
      },
      process: {
        title: "サービスプロセス",
        steps: [
          {
            title: "お問い合わせ",
            description: "お客様のニーズをお聞かせください。"
          },
          {
            title: "詳細ヒアリング",
            description: "専門スタッフが詳細なヒアリングを行います。"
          },
          {
            title: "提案・見積もり",
            description: "最適なソリューションと見積もりをご提案します。"
          },
          {
            title: "契約・実行",
            description: "契約締結後、迅速にサービスを実行します。"
          }
        ]
      },
      cta: {
        title: "サービスについて詳しく知りたいですか？",
        text: "専門スタッフがお客様のニーズに合わせた最適なソリューションをご提案します。",
        contactButton: "お問い合わせ",
        viewMachinery: "機械一覧を見る"
      }
    },
    about: {
      hero: {
        title: "アジュワトレーディングについて",
        subtitle: "グローバル機械取引の信頼できるパートナー"
      },
      mission: {
        title: "私たちの使命",
        description: "日本の機械サプライヤーと世界のバイヤーをつなぎ、使用済み設備の売却を希望する方々に公平で透明性のあるサービスを提供することです。",
        vision: "日本と世界をつなぐリーディングカンパニーになることです。"
      },
      keyFacts: {
        title: "主要実績",
        facts: [
          {
            number: "20+",
            label: "年の実績",
            description: "機械取引における数十年の専門知識"
          },
          {
            number: "50+",
            label: "対応国",
            description: "大陸をまたぐグローバルな展開"
          },
          {
            number: "1000+",
            label: "取引機械数",
            description: "完了した成功取引"
          },
          {
            number: "24h",
            label: "対応時間",
            description: "迅速で信頼できるサービス"
          }
        ]
      },
      values: {
        title: "私たちの価値観",
        values: [
          {
            title: "品質",
            description: "取引する機械の品質を決して妥協しません。"
          },
          {
            title: "信頼",
            description: "透明性と信頼性を通じて長期的な関係を構築します。"
          },
          {
            title: "革新",
            description: "プロセスとサービスを継続的に改善します。"
          },
          {
            title: "顧客重視",
            description: "お客様の成功が私たちの優先事項です。"
          }
        ]
      },
      timeline: {
        title: "私たちの歩み",
        events: [
          {
            year: "2003",
            title: "会社設立",
            description: "東京で小さな機械取引会社としてスタート"
          },
          {
            year: "2008",
            title: "国際展開",
            description: "東南アジア市場への輸出を開始"
          },
          {
            year: "2015",
            title: "グローバルネットワーク",
            description: "30カ国以上でパートナーシップを確立"
          },
          {
            year: "2023",
            title: "デジタル変革",
            description: "包括的なオンラインプラットフォームをローンチ"
          }
        ]
      },
      cta: {
        title: "私たちと一緒に働く準備はできていますか？",
        description: "機械のニーズでアジュワトレーディングを信頼する何千人もの満足したお客様に加わりましょう。",
        button: "始めましょう"
      }
    },
    inquiry: {
      hero: {
        title: "お問い合わせ送信",
        subtitle: "機械のニーズについて教えてください"
      },
      toggle: {
        sell: "売却",
        buy: "購入"
      },
      form: {
        sellTitle: "機械売却",
        sellSubtitle: "使用済み機械の適正価格での買取",
        buyTitle: "機械購入",
        buySubtitle: "ニーズに合った最適な機械を見つけましょう",
        firstName: "名",
        lastName: "姓",
        companyName: "会社名（任意）",
        telephone: "電話番号",
        email: "メールアドレス",
        address: "住所",
        machineInfo: "機械情報",
        machineCompany: "機械メーカー名",
        model: "モデル",
        year: "年式",
        screwSize: "スクリューサイズ",
        weight: "重量",
        location: "所在地",
        condition: "状態",
        description: "追加説明",
        requirements: "要件",
        requirementsPlaceholder: "お探しの機械について詳しく教えてください...",
        selectCondition: "状態を選択",
        conditions: {
          excellent: "優秀",
          good: "良好",
          fair: "普通",
          poor: "不良"
        },
        submit: "お問い合わせ送信",
        submitting: "送信中..."
      },
      validation: {
        required: "この項目は必須です",
        invalidEmail: "有効なメールアドレスを入力してください"
      },
      success: {
        sellTitle: "お問い合わせ送信完了！",
        sellMessage: "担当者が近日中にお客様の機械についてご連絡いたします。",
        buyTitle: "お問い合わせ送信完了！",
        buyMessage: "担当者が近日中に利用可能なオプションについてご連絡いたします。"
      }
    }
  }
}

export function getTranslations(locale: Locale, namespace: string): TranslationData {
  return translations[locale]?.[namespace] || {}
}

export function t(locale: Locale, namespace: string, key: string, fallback?: string): string {
  const translations = getTranslations(locale, namespace)
  
  // Support nested keys like "hero.title"
  const keys = key.split('.')
  let value: any = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }
  
  return typeof value === 'string' ? value : (fallback || key)
}

export function getNestedTranslation(locale: Locale, namespace: string, key: string): any {
  const translations = getTranslations(locale, namespace)
  
  const keys = key.split('.')
  let value: any = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return null
    }
  }
  
  return value
} 