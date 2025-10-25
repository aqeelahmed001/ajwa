"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';

interface SellBuyFormProps {
  lang: string;
  type: 'sell' | 'buy';
}

export default function SellBuyForm({ lang, type }: SellBuyFormProps) {
  const isJapanese = lang === 'ja';
  const isSell = type === 'sell';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    machineType: '',
    machineMake: '',
    machineModel: '',
    machineYear: '',
    machineCondition: '',
    budget: '',
    timeline: '',
    additionalInfo: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Create form data for file upload
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Add files
      files.forEach((file, index) => {
        submitData.append(`file-${index}`, file);
      });
      
      // Add form type
      submitData.append('formType', type);
      
      const response = await fetch('/api/sell-buy-form', {
        method: 'POST',
        body: submitData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(isJapanese 
          ? 'フォームが正常に送信されました。' 
          : 'Your form has been submitted successfully.');
          
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          machineType: '',
          machineMake: '',
          machineModel: '',
          machineYear: '',
          machineCondition: '',
          budget: '',
          timeline: '',
          additionalInfo: '',
        });
        setFiles([]);
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(isJapanese 
        ? 'エラーが発生しました。後でもう一度お試しください。' 
        : 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = {
    title: isSell 
      ? (isJapanese ? '機械を売る' : 'Sell Your Machinery') 
      : (isJapanese ? '機械を購入する' : 'Buy Machinery'),
    subtitle: isSell
      ? (isJapanese 
          ? '機械の売却をお考えですか？以下のフォームに必要事項をご記入ください。当社の専門家がすぐにご連絡いたします。' 
          : 'Looking to sell your machinery? Fill out the form below and our experts will contact you shortly.')
      : (isJapanese 
          ? '必要な機械をお探しですか？以下のフォームに必要事項をご記入いただければ、お客様のニーズに合った機械をご提案いたします。' 
          : 'Looking for specific machinery? Fill out the form below and we will help you find what you need.'),
    nameLabel: isJapanese ? 'お名前' : 'Full Name',
    namePlaceholder: isJapanese ? 'お名前をご入力ください' : 'Enter your full name',
    emailLabel: isJapanese ? 'メールアドレス' : 'Email Address',
    emailPlaceholder: isJapanese ? 'メールアドレスをご入力ください' : 'Enter your email address',
    phoneLabel: isJapanese ? '電話番号' : 'Phone Number',
    phonePlaceholder: isJapanese ? '電話番号をご入力ください' : 'Enter your phone number',
    companyLabel: isJapanese ? '会社名' : 'Company Name',
    companyPlaceholder: isJapanese ? '会社名をご入力ください' : 'Enter your company name',
    machineTypeLabel: isJapanese ? '機械の種類' : 'Machine Type',
    machineTypePlaceholder: isJapanese ? '例: 油圧ショベル、ブルドーザー' : 'e.g., Excavator, Bulldozer',
    machineMakeLabel: isJapanese ? 'メーカー' : 'Machine Make',
    machineMakePlaceholder: isJapanese ? '例: コマツ、日立、キャタピラー' : 'e.g., Komatsu, Hitachi, CAT',
    machineModelLabel: isJapanese ? 'モデル' : 'Machine Model',
    machineModelPlaceholder: isJapanese ? 'モデル番号をご入力ください' : 'Enter model number',
    machineYearLabel: isJapanese ? '製造年' : 'Year of Manufacture',
    machineYearPlaceholder: isJapanese ? '例: 2015' : 'e.g., 2015',
    machineConditionLabel: isJapanese ? '状態' : 'Condition',
    conditionOptions: isJapanese 
      ? ['新品', '良好', '使用済み', '修理が必要'] 
      : ['New', 'Good', 'Used', 'Needs Repair'],
    budgetLabel: isJapanese ? '予算' : 'Budget',
    budgetPlaceholder: isJapanese ? '予算範囲をご入力ください' : 'Enter your budget range',
    timelineLabel: isJapanese ? '希望納期' : 'Timeline',
    timelineOptions: isJapanese 
      ? ['すぐに', '1ヶ月以内', '3ヶ月以内', '6ヶ月以内', '6ヶ月以上'] 
      : ['Immediately', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'More than 6 months'],
    additionalInfoLabel: isJapanese ? '追加情報' : 'Additional Information',
    additionalInfoPlaceholder: isJapanese 
      ? '機械に関する追加情報や特別な要件があればご記入ください' 
      : 'Please provide any additional information or special requirements',
    uploadLabel: isJapanese ? '写真をアップロード' : 'Upload Photos',
    uploadText: isJapanese 
      ? '機械の写真をアップロードしてください（最大5枚）' 
      : 'Upload photos of the machinery (max 5 photos)',
    submitButton: isSell
      ? (isJapanese ? '売却の問い合わせを送信' : 'Submit Selling Inquiry')
      : (isJapanese ? '購入の問い合わせを送信' : 'Submit Buying Inquiry'),
    formDisclaimer: isJapanese 
      ? '※ ご入力いただいた個人情報は、お問い合わせへの対応とそれに付随する業務以外には使用いたしません。' 
      : 'The personal information provided will only be used to respond to your inquiry and associated business operations.',
  };

  return (
    <div className={`bg-white rounded-xl border ${isSell ? 'border-red-200' : 'border-blue-200'} shadow-sm p-6 md:p-8`}>
      <h2 className={`text-2xl font-semibold mb-2 ${isSell ? 'text-red-600' : 'text-blue-600'}`}>
        {content.title}
      </h2>
      <p className="text-gray-600 mb-6">{content.subtitle}</p>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              {content.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={content.namePlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {content.emailLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={content.emailPlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone Field */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              {content.phoneLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={content.phonePlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Company Field */}
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              {content.companyLabel}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={content.companyPlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Machine Type Field */}
          <div className="space-y-2">
            <label htmlFor="machineType" className="text-sm font-medium">
              {content.machineTypeLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="machineType"
              name="machineType"
              value={formData.machineType}
              onChange={handleChange}
              placeholder={content.machineTypePlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Machine Make Field */}
          <div className="space-y-2">
            <label htmlFor="machineMake" className="text-sm font-medium">
              {content.machineMakeLabel}
            </label>
            <input
              type="text"
              id="machineMake"
              name="machineMake"
              value={formData.machineMake}
              onChange={handleChange}
              placeholder={content.machineMakePlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Machine Model Field */}
          <div className="space-y-2">
            <label htmlFor="machineModel" className="text-sm font-medium">
              {content.machineModelLabel}
            </label>
            <input
              type="text"
              id="machineModel"
              name="machineModel"
              value={formData.machineModel}
              onChange={handleChange}
              placeholder={content.machineModelPlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Machine Year Field */}
          <div className="space-y-2">
            <label htmlFor="machineYear" className="text-sm font-medium">
              {content.machineYearLabel}
            </label>
            <input
              type="text"
              id="machineYear"
              name="machineYear"
              value={formData.machineYear}
              onChange={handleChange}
              placeholder={content.machineYearPlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Machine Condition Field */}
          <div className="space-y-2">
            <label htmlFor="machineCondition" className="text-sm font-medium">
              {content.machineConditionLabel} {isSell && <span className="text-red-500">*</span>}
            </label>
            <select
              id="machineCondition"
              name="machineCondition"
              value={formData.machineCondition}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required={isSell}
            >
              <option value="" disabled>-- {isJapanese ? '選択してください' : 'Select one'} --</option>
              {content.conditionOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          {/* Budget Field */}
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">
              {content.budgetLabel} {!isSell && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder={content.budgetPlaceholder}
              className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required={!isSell}
            />
          </div>
        </div>
        
        {/* Timeline Field */}
        <div className="space-y-2">
          <label htmlFor="timeline" className="text-sm font-medium">
            {content.timelineLabel}
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>-- {isJapanese ? '選択してください' : 'Select one'} --</option>
            {content.timelineOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Additional Info Field */}
        <div className="space-y-2">
          <label htmlFor="additionalInfo" className="text-sm font-medium">
            {content.additionalInfoLabel}
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            placeholder={content.additionalInfoPlaceholder}
            className="w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        
        {/* File Upload - Only for Sell form */}
        {isSell && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {content.uploadLabel}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                    <span>{isJapanese ? 'ファイルを選択' : 'Select files'}</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={files.length >= 5}
                    />
                  </label>
                  <p className="pl-1">{isJapanese ? 'またはドラッグ＆ドロップ' : 'or drag and drop'}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {content.uploadText}
                </p>
              </div>
            </div>
            
            {/* File preview */}
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="h-24 w-full border rounded-md overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-xs text-gray-500">
            {content.formDisclaimer}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSell ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-70 flex items-center justify-center min-w-[180px]`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {isJapanese ? '送信中...' : 'Sending...'}
              </>
            ) : (
              content.submitButton
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
