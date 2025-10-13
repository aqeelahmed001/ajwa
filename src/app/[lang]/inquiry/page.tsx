"use client";

import React, { useState } from 'react'
import { motion, cubicBezier } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Send, 
  ShoppingCart, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  Scale,
  Settings
} from 'lucide-react'
import { useInquiryTranslations } from '@/lib/useTranslations'
import { type Locale } from '@/lib/translations'
import JapaneseAddressForm from '@/components/forms/JapaneseAddressForm'

interface JapaneseAddress {
  postalCode: string
  prefecture: string
  city: string
  address: string
}

interface SellFormData {
  firstName: string
  lastName: string
  companyName: string
  telephone: string
  email: string
  address: string
  japaneseAddress?: JapaneseAddress
  machineCompany: string
  model: string
  year: string
  screwSize: string
  weight: string
  location: string
  condition: string
  description: string
}

interface BuyFormData {
  firstName: string
  lastName: string
  companyName: string
  telephone: string
  email: string
  address: string
  japaneseAddress?: JapaneseAddress
  requirements: string
}

export default function InquiryPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const translations = useInquiryTranslations(locale)
  
  const [isSellMode, setIsSellMode] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isInJapan, setIsInJapan] = useState(false)
  
  const [sellFormData, setSellFormData] = useState<SellFormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    telephone: '',
    email: '',
    address: '',
    japaneseAddress: {
      postalCode: '',
      prefecture: '',
      city: '',
      address: ''
    },
    machineCompany: '',
    model: '',
    year: '',
    screwSize: '',
    weight: '',
    location: '',
    condition: '',
    description: ''
  })
  
  const [buyFormData, setBuyFormData] = useState<BuyFormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    telephone: '',
    email: '',
    address: '',
    japaneseAddress: {
      postalCode: '',
      prefecture: '',
      city: '',
      address: ''
    },
    requirements: ''
  })

  const validateForm = (data: any, isSell: boolean): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    
    if (!data.firstName.trim()) newErrors.firstName = translations.validation.required
    if (!data.lastName.trim()) newErrors.lastName = translations.validation.required
    if (!data.telephone.trim()) newErrors.telephone = translations.validation.required
    if (!data.email.trim()) newErrors.email = translations.validation.required
    if (!data.address.trim()) newErrors.address = translations.validation.required
    
    if (isSell) {
      if (!data.machineCompany.trim()) newErrors.machineCompany = translations.validation.required
      if (!data.model.trim()) newErrors.model = translations.validation.required
      if (!data.year.trim()) newErrors.year = translations.validation.required
      if (!data.location.trim()) newErrors.location = translations.validation.required
      if (!data.condition.trim()) newErrors.condition = translations.validation.required
    } else {
      if (!data.requirements.trim()) newErrors.requirements = translations.validation.required
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (data.email && !emailRegex.test(data.email)) {
      newErrors.email = translations.validation.invalidEmail
    }
    
    return newErrors
  }

  const handleSellFormChange = (field: keyof SellFormData, value: string) => {
    setSellFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleBuyFormChange = (field: keyof BuyFormData, value: string) => {
    setBuyFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSellJapaneseAddressChange = (japaneseAddress: JapaneseAddress) => {
    setSellFormData(prev => ({ 
      ...prev, 
      japaneseAddress,
      address: `${japaneseAddress.prefecture} ${japaneseAddress.city} ${japaneseAddress.address}`.trim()
    }))
  }

  const handleBuyJapaneseAddressChange = (japaneseAddress: JapaneseAddress) => {
    setBuyFormData(prev => ({ 
      ...prev, 
      japaneseAddress,
      address: `${japaneseAddress.prefecture} ${japaneseAddress.city} ${japaneseAddress.address}`.trim()
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    
    const formData = isSellMode ? sellFormData : buyFormData
    const validationErrors = validateForm(formData, isSellMode)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Reset form
    if (isSellMode) {
      setSellFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        telephone: '',
        email: '',
        address: '',
        japaneseAddress: {
          postalCode: '',
          prefecture: '',
          city: '',
          address: ''
        },
        machineCompany: '',
        model: '',
        year: '',
        screwSize: '',
        weight: '',
        location: '',
        condition: '',
        description: ''
      })
    } else {
      setBuyFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        telephone: '',
        email: '',
        address: '',
        japaneseAddress: {
          postalCode: '',
          prefecture: '',
          city: '',
          address: ''
        },
        requirements: ''
      })
    }
    
    // Reset Japan toggle
    setIsInJapan(false)
    
    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: cubicBezier(0.23, 1, 0.32, 1) } },
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[300px] flex items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-parrot-red/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10 py-16 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.23, 1, 0.32, 1) }}
          >
            {translations.hero.title}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: cubicBezier(0.23, 1, 0.32, 1) }}
          >
            {translations.hero.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="container py-16">
        {/* Toggle Section */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="p-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-parrot-red" />
                <span className="font-medium">{translations.toggle.sell}</span>
              </div>
              <Switch
                checked={!isSellMode}
                onCheckedChange={(checked) => setIsSellMode(!checked)}
                className="data-[state=checked]:bg-primary"
              />
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-medium">{translations.toggle.buy}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Success Alert */}
        {showSuccess && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      {isSellMode ? translations.success.sellTitle : translations.success.buyTitle}
                    </h3>
                    <p className="text-green-700">
                      {isSellMode ? translations.success.sellMessage : translations.success.buyMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Form Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isSellMode ? translations.form.sellTitle : translations.form.buyTitle}
              </CardTitle>
              <p className="text-muted-foreground">
                {isSellMode ? translations.form.sellSubtitle : translations.form.buySubtitle}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">{translations.form.firstName} *</Label>
                    <Input
                      id="firstName"
                      value={isSellMode ? sellFormData.firstName : buyFormData.firstName}
                      onChange={(e) => isSellMode 
                        ? handleSellFormChange('firstName', e.target.value)
                        : handleBuyFormChange('firstName', e.target.value)
                      }
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">{translations.form.lastName} *</Label>
                    <Input
                      id="lastName"
                      value={isSellMode ? sellFormData.lastName : buyFormData.lastName}
                      onChange={(e) => isSellMode 
                        ? handleSellFormChange('lastName', e.target.value)
                        : handleBuyFormChange('lastName', e.target.value)
                      }
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="companyName">{translations.form.companyName}</Label>
                    <Input
                      id="companyName"
                      value={isSellMode ? sellFormData.companyName : buyFormData.companyName}
                      onChange={(e) => isSellMode 
                        ? handleSellFormChange('companyName', e.target.value)
                        : handleBuyFormChange('companyName', e.target.value)
                      }
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telephone">{translations.form.telephone} *</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={isSellMode ? sellFormData.telephone : buyFormData.telephone}
                      onChange={(e) => isSellMode 
                        ? handleSellFormChange('telephone', e.target.value)
                        : handleBuyFormChange('telephone', e.target.value)
                      }
                      className={errors.telephone ? 'border-red-500' : ''}
                    />
                    {errors.telephone && (
                      <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{translations.form.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isSellMode ? sellFormData.email : buyFormData.email}
                      onChange={(e) => isSellMode 
                        ? handleSellFormChange('email', e.target.value)
                        : handleBuyFormChange('email', e.target.value)
                      }
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      {/* Japan Address Toggle */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="japan-address"
                          checked={isInJapan}
                          onCheckedChange={setIsInJapan}
                        />
                        <Label htmlFor="japan-address" className="text-sm font-medium">
                          {locale === 'ja' ? '日本の住所を使用' : 'Use Japanese Address'}
                        </Label>
                      </div>

                      {isInJapan ? (
                        /* Japanese Address Form */
                        <JapaneseAddressForm
                          value={isSellMode ? sellFormData.japaneseAddress! : buyFormData.japaneseAddress!}
                          onChange={isSellMode ? handleSellJapaneseAddressChange : handleBuyJapaneseAddressChange}
                          errors={errors}
                          lang={locale}
                        />
                      ) : (
                        /* Regular Address Input */
                        <>
                          <Label htmlFor="address">{translations.form.address} *</Label>
                          <Textarea
                            id="address"
                            value={isSellMode ? sellFormData.address : buyFormData.address}
                            onChange={(e) => isSellMode 
                              ? handleSellFormChange('address', e.target.value)
                              : handleBuyFormChange('address', e.target.value)
                            }
                            className={errors.address ? 'border-red-500' : ''}
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Machine Information (Sell Mode Only) */}
                {isSellMode && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        {translations.form.machineInfo}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="machineCompany">{translations.form.machineCompany} *</Label>
                          <Input
                            id="machineCompany"
                            value={sellFormData.machineCompany}
                            onChange={(e) => handleSellFormChange('machineCompany', e.target.value)}
                            className={errors.machineCompany ? 'border-red-500' : ''}
                          />
                          {errors.machineCompany && (
                            <p className="text-red-500 text-sm mt-1">{errors.machineCompany}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="model">{translations.form.model} *</Label>
                          <Input
                            id="model"
                            value={sellFormData.model}
                            onChange={(e) => handleSellFormChange('model', e.target.value)}
                            className={errors.model ? 'border-red-500' : ''}
                          />
                          {errors.model && (
                            <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="year">{translations.form.year} *</Label>
                          <Input
                            id="year"
                            value={sellFormData.year}
                            onChange={(e) => handleSellFormChange('year', e.target.value)}
                            className={errors.year ? 'border-red-500' : ''}
                          />
                          {errors.year && (
                            <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="screwSize">{translations.form.screwSize}</Label>
                          <Input
                            id="screwSize"
                            value={sellFormData.screwSize}
                            onChange={(e) => handleSellFormChange('screwSize', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="weight">{translations.form.weight}</Label>
                          <Input
                            id="weight"
                            value={sellFormData.weight}
                            onChange={(e) => handleSellFormChange('weight', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="location">{translations.form.location} *</Label>
                          <Input
                            id="location"
                            value={sellFormData.location}
                            onChange={(e) => handleSellFormChange('location', e.target.value)}
                            className={errors.location ? 'border-red-500' : ''}
                          />
                          {errors.location && (
                            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="condition">{translations.form.condition} *</Label>
                          <Select
                            value={sellFormData.condition}
                            onValueChange={(value) => handleSellFormChange('condition', value)}
                          >
                            <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                              <SelectValue placeholder={translations.form.selectCondition} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">{translations.form.conditions.excellent}</SelectItem>
                              <SelectItem value="good">{translations.form.conditions.good}</SelectItem>
                              <SelectItem value="fair">{translations.form.conditions.fair}</SelectItem>
                              <SelectItem value="poor">{translations.form.conditions.poor}</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.condition && (
                            <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="description">{translations.form.description}</Label>
                          <Textarea
                            id="description"
                            value={sellFormData.description}
                            onChange={(e) => handleSellFormChange('description', e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Requirements (Buy Mode Only) */}
                {!isSellMode && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {translations.form.requirements}
                    </h3>
                    
                    <div>
                      <Label htmlFor="requirements">{translations.form.requirements} *</Label>
                      <Textarea
                        id="requirements"
                        value={buyFormData.requirements}
                        onChange={(e) => handleBuyFormChange('requirements', e.target.value)}
                        rows={6}
                        placeholder={translations.form.requirementsPlaceholder}
                        className={errors.requirements ? 'border-red-500' : ''}
                      />
                      {errors.requirements && (
                        <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{translations.form.submitting}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>{translations.form.submit}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 