"use client";

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Loader2 } from 'lucide-react'

interface JapaneseAddress {
  postalCode: string
  prefecture: string
  city: string
  address: string
}

interface JapaneseAddressFormProps {
  value: JapaneseAddress
  onChange: (address: JapaneseAddress) => void
  errors?: Record<string, string>
  lang: string
}

// Japanese prefectures data
const JAPANESE_PREFECTURES = [
  { code: '01', name: '北海道', nameEn: 'Hokkaido' },
  { code: '02', name: '青森県', nameEn: 'Aomori' },
  { code: '03', name: '岩手県', nameEn: 'Iwate' },
  { code: '04', name: '宮城県', nameEn: 'Miyagi' },
  { code: '05', name: '秋田県', nameEn: 'Akita' },
  { code: '06', name: '山形県', nameEn: 'Yamagata' },
  { code: '07', name: '福島県', nameEn: 'Fukushima' },
  { code: '08', name: '茨城県', nameEn: 'Ibaraki' },
  { code: '09', name: '栃木県', nameEn: 'Tochigi' },
  { code: '10', name: '群馬県', nameEn: 'Gunma' },
  { code: '11', name: '埼玉県', nameEn: 'Saitama' },
  { code: '12', name: '千葉県', nameEn: 'Chiba' },
  { code: '13', name: '東京都', nameEn: 'Tokyo' },
  { code: '14', name: '神奈川県', nameEn: 'Kanagawa' },
  { code: '15', name: '新潟県', nameEn: 'Niigata' },
  { code: '16', name: '富山県', nameEn: 'Toyama' },
  { code: '17', name: '石川県', nameEn: 'Ishikawa' },
  { code: '18', name: '福井県', nameEn: 'Fukui' },
  { code: '19', name: '山梨県', nameEn: 'Yamanashi' },
  { code: '20', name: '長野県', nameEn: 'Nagano' },
  { code: '21', name: '岐阜県', nameEn: 'Gifu' },
  { code: '22', name: '静岡県', nameEn: 'Shizuoka' },
  { code: '23', name: '愛知県', nameEn: 'Aichi' },
  { code: '24', name: '三重県', nameEn: 'Mie' },
  { code: '25', name: '滋賀県', nameEn: 'Shiga' },
  { code: '26', name: '京都府', nameEn: 'Kyoto' },
  { code: '27', name: '大阪府', nameEn: 'Osaka' },
  { code: '28', name: '兵庫県', nameEn: 'Hyogo' },
  { code: '29', name: '奈良県', nameEn: 'Nara' },
  { code: '30', name: '和歌山県', nameEn: 'Wakayama' },
  { code: '31', name: '鳥取県', nameEn: 'Tottori' },
  { code: '32', name: '島根県', nameEn: 'Shimane' },
  { code: '33', name: '岡山県', nameEn: 'Okayama' },
  { code: '34', name: '広島県', nameEn: 'Hiroshima' },
  { code: '35', name: '山口県', nameEn: 'Yamaguchi' },
  { code: '36', name: '徳島県', nameEn: 'Tokushima' },
  { code: '37', name: '香川県', nameEn: 'Kagawa' },
  { code: '38', name: '愛媛県', nameEn: 'Ehime' },
  { code: '39', name: '高知県', nameEn: 'Kochi' },
  { code: '40', name: '福岡県', nameEn: 'Fukuoka' },
  { code: '41', name: '佐賀県', nameEn: 'Saga' },
  { code: '42', name: '長崎県', nameEn: 'Nagasaki' },
  { code: '43', name: '熊本県', nameEn: 'Kumamoto' },
  { code: '44', name: '大分県', nameEn: 'Oita' },
  { code: '45', name: '宮崎県', nameEn: 'Miyazaki' },
  { code: '46', name: '鹿児島県', nameEn: 'Kagoshima' },
  { code: '47', name: '沖縄県', nameEn: 'Okinawa' }
]

// Sample cities for each prefecture (you can expand this)
const CITIES_BY_PREFECTURE: Record<string, string[]> = {
  '13': ['千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区', '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区', '北区', '荒川区', '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区'],
  '27': ['大阪市', '堺市', '岸和田市', '豊中市', '池田市', '吹田市', '泉大津市', '高槻市', '貝塚市', '守口市', '枚方市', '茨木市', '八尾市', '泉佐野市', '富田林市', '寝屋川市', '河内長野市', '松原市', '大東市', '和泉市', '箕面市', '柏原市', '羽曳野市', '門真市', '摂津市', '高石市', '藤井寺市', '東大阪市', '泉南市', '四條畷市', '交野市', '大阪狭山市', '阪南市', '島本町', '豊能町', '能勢町', '忠岡町', '熊取町', '田尻町', '岬町', '太子町', '河南町', '千早赤阪村'],
  '14': ['横浜市', '川崎市', '相模原市', '横須賀市', '平塚市', '鎌倉市', '藤沢市', '小田原市', '茅ヶ崎市', '逗子市', '三浦市', '秦野市', '厚木市', '大和市', '伊勢原市', '海老名市', '座間市', '南足柄市', '綾瀬市'],
  '23': ['名古屋市', '豊橋市', '岡崎市', '一宮市', '瀬戸市', '半田市', '春日井市', '豊川市', '津島市', '碧南市', '刈谷市', '豊田市', '安城市', '西尾市', '蒲郡市', '犬山市', '常滑市', '江南市', '小牧市', '稲沢市', '新城市', '東海市', '大府市', '知多市', '知立市', '尾張旭市', '高浜市', '岩倉市', '豊明市', '日進市', '田原市', '愛西市', '清須市', '北名古屋市', '弥富市', 'みよし市', 'あま市', '長久手市'],
  '11': ['さいたま市', '川越市', '熊谷市', '川口市', '行田市', '秩父市', '所沢市', '飯能市', '加須市', '本庄市', '東松山市', '春日部市', '狭山市', '羽生市', '鴻巣市', '深谷市', '上尾市', '草加市', '越谷市', '蕨市', '戸田市', '入間市', '朝霞市', '志木市', '和光市', '新座市', '桶川市', '久喜市', '北本市', '八潮市', '富士見市', '三郷市', '蓮田市', '坂戸市', '幸手市', '鶴ヶ島市', '日高市', '吉川市', 'ふじみ野市', '白岡市']
}

export default function JapaneseAddressForm({ value, onChange, errors, lang }: JapaneseAddressFormProps) {
  const isJapanese = lang === 'ja'
  const [isLoading, setIsLoading] = useState(false)
  const [postalCodeError, setPostalCodeError] = useState('')

  // Translations
  const translations = {
    postalCode: isJapanese ? '郵便番号' : 'Postal Code',
    prefecture: isJapanese ? '都道府県' : 'Prefecture',
    city: isJapanese ? '市区町村' : 'City',
    address: isJapanese ? '住所' : 'Address',
    searchByPostalCode: isJapanese ? '郵便番号で検索' : 'Search by Postal Code',
    searchByPrefecture: isJapanese ? '都道府県で選択' : 'Select by Prefecture',
    loading: isJapanese ? '検索中...' : 'Searching...',
    invalidPostalCode: isJapanese ? '有効な郵便番号を入力してください' : 'Please enter a valid postal code',
    noResults: isJapanese ? '該当する住所が見つかりませんでした' : 'No address found for this postal code',
    placeholder: {
      postalCode: isJapanese ? '例: 100-0001' : 'e.g., 100-0001',
      address: isJapanese ? '例: 1-1-1 丸の内' : 'e.g., 1-1-1 Marunouchi'
    }
  }

  // Format postal code input
  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '')
    if (cleaned.length <= 3) return cleaned
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
  }

  // Handle postal code input change
  const handlePostalCodeChange = (newValue: string) => {
    const formatted = formatPostalCode(newValue)
    onChange({ ...value, postalCode: formatted })
    setPostalCodeError('')
  }

  // Search address by postal code
  const searchByPostalCode = async () => {
    if (!value.postalCode || value.postalCode.length < 7) {
      setPostalCodeError(translations.invalidPostalCode)
      return
    }

    setIsLoading(true)
    setPostalCodeError('')

    try {
      // Simulate API call to postal code service
      // In a real implementation, you would use a service like:
      // - Japan Post API
      // - Google Maps Geocoding API
      // - Yahoo! Japan Address API
      
      const cleanedCode = value.postalCode.replace('-', '')
      
      // Simulate API response based on postal code
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - in real implementation, this would come from API
      const mockAddressData: Record<string, { prefecture: string, city: string }> = {
        '1000001': { prefecture: '13', city: '千代田区' },
        '1000002': { prefecture: '13', city: '千代田区' },
        '5300001': { prefecture: '27', city: '大阪市' },
        '5300002': { prefecture: '27', city: '大阪市' },
        '2200001': { prefecture: '14', city: '横浜市' },
        '2200002': { prefecture: '14', city: '横浜市' },
        '4600001': { prefecture: '23', city: '名古屋市' },
        '4600002': { prefecture: '23', city: '名古屋市' },
        '3300001': { prefecture: '11', city: 'さいたま市' },
        '3300002': { prefecture: '11', city: 'さいたま市' }
      }

      const addressData = mockAddressData[cleanedCode]
      
      if (addressData) {
        onChange({
          ...value,
          prefecture: addressData.prefecture,
          city: addressData.city
        })
      } else {
        setPostalCodeError(translations.noResults)
      }
    } catch (error) {
      setPostalCodeError(isJapanese ? '検索中にエラーが発生しました' : 'An error occurred during search')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle prefecture change
  const handlePrefectureChange = (prefectureCode: string) => {
    onChange({
      ...value,
      prefecture: prefectureCode,
      city: '' // Reset city when prefecture changes
    })
  }

  // Handle city change
  const handleCityChange = (city: string) => {
    onChange({
      ...value,
      city
    })
  }

  // Handle address change
  const handleAddressChange = (address: string) => {
    onChange({
      ...value,
      address
    })
  }

  // Get available cities for selected prefecture
  const getAvailableCities = () => {
    if (!value.prefecture) return []
    return CITIES_BY_PREFECTURE[value.prefecture] || []
  }

  return (
    <div className="space-y-4">
      {/* Postal Code Search */}
      <div className="space-y-2">
        <Label htmlFor="postalCode" className="text-sm font-medium">
          {translations.postalCode}
        </Label>
        <div className="flex gap-2">
          <Input
            id="postalCode"
            value={value.postalCode}
            onChange={(e) => handlePostalCodeChange(e.target.value)}
            placeholder={translations.placeholder.postalCode}
            className="flex-1"
            maxLength={8}
          />
          <Button
            type="button"
            onClick={searchByPostalCode}
            disabled={isLoading || !value.postalCode}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        {postalCodeError && (
          <p className="text-sm text-red-500">{postalCodeError}</p>
        )}
      </div>

      {/* Prefecture Selection */}
      <div className="space-y-2">
        <Label htmlFor="prefecture" className="text-sm font-medium">
          {translations.prefecture}
        </Label>
        <Select value={value.prefecture} onValueChange={handlePrefectureChange}>
          <SelectTrigger id="prefecture">
            <SelectValue placeholder={translations.prefecture} />
          </SelectTrigger>
          <SelectContent>
            {JAPANESE_PREFECTURES.map((prefecture) => (
              <SelectItem key={prefecture.code} value={prefecture.code}>
                {isJapanese ? prefecture.name : prefecture.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.prefecture && (
          <p className="text-sm text-red-500">{errors.prefecture}</p>
        )}
      </div>

      {/* City Selection */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium">
          {translations.city}
        </Label>
        <Select value={value.city} onValueChange={handleCityChange} disabled={!value.prefecture}>
          <SelectTrigger id="city">
            <SelectValue placeholder={value.prefecture ? translations.city : translations.prefecture} />
          </SelectTrigger>
          <SelectContent>
            {getAvailableCities().map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.city && (
          <p className="text-sm text-red-500">{errors.city}</p>
        )}
      </div>

      {/* Address Input */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          {translations.address}
        </Label>
        <Input
          id="address"
          value={value.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder={translations.placeholder.address}
        />
        {errors?.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Full Address Display */}
      {value.prefecture && value.city && (
        <div className="p-3 bg-slate-50 rounded-lg border">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>
              {isJapanese 
                ? `${JAPANESE_PREFECTURES.find(p => p.code === value.prefecture)?.name} ${value.city} ${value.address}`
                : `${JAPANESE_PREFECTURES.find(p => p.code === value.prefecture)?.nameEn} ${value.city} ${value.address}`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 