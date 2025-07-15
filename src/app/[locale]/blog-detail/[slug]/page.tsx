'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from 'next-intl';

import Wrapper from "@/app/[locale]/components/wrapper";
import { blogService } from "@/api/services/blogs";
import type { Blog, BlogTranslation } from "@/types/property";
import { ApiError } from "@/api/errors";

import { FiFacebook, FiGithub, FiGitlab, FiInstagram, FiLinkedin, FiMail, FiMessageCircle, FiTwitter, FiUser, FiYoutube, FiEdit, FiTrash2, FiGlobe } from "react-icons/fi";

const SUPPORTED_LANGUAGES = [
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'vn', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' }
];

export default function BlogDetail(){
    const params = useParams(); 
    const t = useTranslations('blog');
    const slug = String(params?.slug || '');
    const locale = String(params?.locale || 'en');
    
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [currentViewLanguage, setCurrentViewLanguage] = useState<string>('');
    const [currentBlogData, setCurrentBlogData] = useState<Blog | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use global locale for initial blog fetch
                const data = await blogService.getBlogBySlug(locale, slug);
                setBlog(data);
                setCurrentBlogData(data);
                setCurrentViewLanguage(data.language);
                
                // Fetch available languages for this blog
                if (data.id) {
                    try {
                        // Use global locale for languages endpoint
                        const languagesResponse = await blogService.getBlogLanguages(locale, data.id);
                        setAvailableLanguages(languagesResponse.languages);
                    } catch (langError) {
                        console.error('Error fetching blog languages:', langError);
                        // Fallback to just the blog's language if languages endpoint fails
                        setAvailableLanguages([data.language]);
                    }
                }
            } catch (err) {
                const errorMessage = err instanceof ApiError 
                    ? err.message 
                    : t('failedToLoadDetails');
                setError(errorMessage);
                console.error('Error fetching blog:', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug, locale]);

    const fetchBlogByLanguage = async (language: string) => {
        if (!blog) return;
        
        try {
            setLoading(true);
            // Special case: Use the selected language as the locale for API call
            // This allows viewing content in different languages regardless of global locale
            const data = await blogService.getBlogBySlugAndLanguage(language, slug, language);
            setCurrentBlogData(data);
            setCurrentViewLanguage(language);
        } catch (err) {
            console.error('Error fetching blog in language:', language, err);
            // Fallback to original blog data
            setCurrentBlogData(blog);
            setCurrentViewLanguage(blog.language);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleTranslate = async () => {
        if (!blog || !selectedLanguage) return;
        
        try {
            setTranslating(selectedLanguage);
            // Use global locale for translation operations
            await blogService.translateBlog(locale, blog.id, {
                targetLanguage: selectedLanguage,
                sourceLanguage: blog.language
            });
            
            // Refresh the blog data to get updated translations
            // Use global locale for refreshing the original blog
            const updatedBlog = await blogService.getBlogBySlug(locale, slug);
            setBlog(updatedBlog);
            
            // Refresh available languages
            try {
                // Use global locale for languages endpoint
                const languagesResponse = await blogService.getBlogLanguages(locale, blog.id);
                setAvailableLanguages(languagesResponse.languages);
            } catch (langError) {
                console.error('Error refreshing blog languages:', langError);
            }
            
            // Reset selection and show success message
            setSelectedLanguage('');
            console.log(t('translationSuccess'));
        } catch (err) {
            console.error('Translation error:', err);
            console.error(t('translationError'));
        } finally {
            setTranslating(null);
        }
    };

    const getMissingLanguages = () => {
        const available = availableLanguages;
        return SUPPORTED_LANGUAGES.filter(lang => !available.includes(lang.code));
    };

    const getLanguageName = (code: string) => {
        return t(`languages.${code}`) || code.toUpperCase();
    };

    if (loading) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    if (error || !blog) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="text-center">
                            <div className="text-red-600 mb-4">{error || t('blogNotFound')}</div>
                            <Link href="/blog" className="btn btn-primary">
                                {t('backToBlogs')}
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    const missingLanguages = getMissingLanguages();

    return(
        <Wrapper>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">{currentBlogData?.name || blog.name}</h5>

                    <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Blog Detail</li>
                    </ul>
                </div>

                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                    <div className="lg:col-span-8 md:order-1 order-2">
                        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700">

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-400 text-sm">
                                        <i className="mdi mdi-calendar-month align-middle text-base text-slate-900 dark:text-white me-2"></i>
                                        {formatDate(currentBlogData?.date || blog.date)}
                                    </span>
                                    {currentBlogData?.tags && currentBlogData.tags.length > 0 && (
                                        <div className="flex gap-2">
                                            {currentBlogData.tags.map((tag, index) => (
                                                <span key={index} className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {currentBlogData?.pictures && currentBlogData.pictures.length > 0 && (
                                    <div className="mb-6">
                                        <Image 
                                            src={currentBlogData.pictures[0] || '/images/placeholder.webp'} 
                                            width={400} 
                                            height={300} 
                                            className="w-full max-w-md mx-auto rounded-lg shadow-md" 
                                            alt={currentBlogData.name}
                                        />
                                    </div>
                                )}
                                
                                <div className="prose prose-lg max-w-none dark:prose-invert">
                                    <div dangerouslySetInnerHTML={{ __html: currentBlogData?.content || blog.content }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:order-2 order-1">
                        {/* Control Panel */}
                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700 mb-6">
                            <h5 className="font-medium text-lg mb-4">Control Panel</h5>
                            <div className="space-y-3">
                                <Link 
                                    href={`/blog-detail/${blog.slug}/edit`} 
                                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <FiEdit className="h-4 w-4" />
                                    {t('edit')}
                                </Link>
                                <button 
                                    className="btn btn-danger w-full flex items-center justify-center gap-2"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this blog?')) {
                                            // Handle delete
                                            console.log('Delete blog:', blog.id);
                                        }
                                    }}
                                >
                                    <FiTrash2 className="h-4 w-4" />
                                    {t('delete')}
                                </button>
                            </div>
                        </div>

                        {/* Translation Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700 mb-6">
                            <h5 className="font-medium text-lg mb-4 flex items-center gap-2">
                                <FiGlobe className="h-5 w-5" />
                                {t('translations')}
                            </h5>
                            
                            {/* Available Languages */}
                            {availableLanguages.length > 0 && (
                                <div className="mb-6">
                                    <h6 className="font-medium text-sm mb-3 text-gray-600 dark:text-gray-400">{t('availableLanguages')}</h6>
                                    <div className="flex flex-wrap gap-2">
                                        {availableLanguages.map(langCode => {
                                            const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                                            const isCurrentLanguage = langCode === currentViewLanguage;
                                            const isOriginalLanguage = langCode === blog.language;
                                            
                                            return (
                                                <button
                                                    key={langCode}
                                                    onClick={() => fetchBlogByLanguage(langCode)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105 ${
                                                        isCurrentLanguage
                                                            ? 'bg-green-600 text-white border border-green-600 shadow-md' 
                                                            : isOriginalLanguage
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800' 
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    <span className="text-lg">{lang?.flag || '🌐'}</span>
                                                    <span>{lang?.name || getLanguageName(langCode)}</span>
                                                    {isCurrentLanguage && (
                                                        <span className="text-xs">(current)</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Translation Interface */}
                            {missingLanguages.length > 0 && (
                                <div>
                                    <h6 className="font-medium text-sm mb-3 text-gray-600 dark:text-gray-400">{t('missingLanguages')}</h6>
                                    
                                    {/* Language Selection */}
                                    <div className="mb-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            {missingLanguages.map(lang => (
                                                <label 
                                                    key={lang.code}
                                                    className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-green-300 dark:hover:border-green-600 ${
                                                        selectedLanguage === lang.code 
                                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                                            : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="targetLanguage"
                                                        value={lang.code}
                                                        checked={selectedLanguage === lang.code}
                                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <div className="text-center">
                                                        <div className="text-2xl mb-1">{lang.flag}</div>
                                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            {lang.name}
                                                        </div>
                                                    </div>
                                                    {selectedLanguage === lang.code && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Translate Button */}
                                    <button
                                        onClick={handleTranslate}
                                        disabled={!selectedLanguage || translating !== null}
                                        className={`w-full btn flex items-center justify-center gap-2 transition-all duration-200 ${
                                            selectedLanguage 
                                                ? 'btn-primary bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                                                : 'btn-outline-primary opacity-50 cursor-not-allowed'
                                        }`}
                                    >
                                        {translating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                {t('translating')}
                                            </>
                                        ) : (
                                            <>
                                                <FiGlobe className="h-4 w-4" />
                                                {selectedLanguage 
                                                    ? `${t('translate')} to ${getLanguageName(selectedLanguage)}`
                                                    : t('translate')
                                                }
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {availableLanguages.length === 0 && missingLanguages.length === 0 && (
                                <p className="text-sm text-gray-500">{t('noTranslations')}</p>
                            )}
                        </div>

                        {/* Social Sites */}
                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                            <h5 className="font-medium text-lg mt-[30px]">{t('socialSites')}</h5>
                            <ul className="list-none mt-4">
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiFacebook className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiInstagram className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiTwitter className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiLinkedin className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiGithub className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiYoutube className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiGitlab className="h-4 w-4"/></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Wrapper>
    )
} 