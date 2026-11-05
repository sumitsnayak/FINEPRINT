import React, { useState } from 'react';
import {
  Flame,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  X,
  BookOpen,
  Eye,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface Article {
  id: string;
  category: 'additives' | 'sugars' | 'gut' | 'truth';
  categoryLabel: string;
  tag: string;
  readTime: string;
  title: string;
  subtitle: string;
  image: string;
  statNumber: string;
  statLabel: string;
  keyTakeaway: string;
  fullBody: {
    problem: string;
    science: string;
    fssaiStatus: string;
    groceryRule: string;
  };
}

const ARTICLES: Article[] = [
  {
    id: 'palm-oil-loophole',
    category: 'truth',
    categoryLabel: 'Ingredients Truth',
    tag: '#Debunked',
    readTime: '2 min read',
    title: 'The Palm Oil Loophole: Why 82% of "Healthy" Snacks Lie',
    subtitle: 'How brands disguise cheap hydrogenated palm olein under generic label names.',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=700&q=80',
    statNumber: '82%',
    statLabel: 'Indian snacks contain cheap palmolein with 40%+ saturated fat',
    keyTakeaway: 'Always look for "Edible Vegetable Oil" in the fine print—9 out of 10 times it is heated palmolein.',
    fullBody: {
      problem:
        'Front-of-pack labels loudly boast "Zero Cholesterol", "Baked Not Fried", and "Made with 100% Whole Wheat". But flipping to the back ingredients list reveals "Edible Vegetable Oil (Palmolein)". Because palm oil has no animal cholesterol, marketing teams exploit this technicality to imply heart-healthy status.',
      science:
        'Palmolein is approximately 45% to 50% saturated fatty acids (palmitic acid). When heated repeatedly in industrial extrusion and baking, it forms oxidized lipid peroxides and advanced glycation end-products that trigger systemic endothelial inflammation and elevate LDL particle density.',
      fssaiStatus:
        'Under FSSAI Labeling Regulations 2020, manufacturers are technically allowed to state "Edible Vegetable Oil" provided the specific source (e.g. Palmolein, Cottonseed) is indicated in brackets, yet many brands minimize font sizing down to the 1mm regulatory minimum.',
      groceryRule:
        'Look for products specifying cold-pressed mustard oil, high-oleic sunflower oil, extra virgin olive oil, or coconut oil instead of generic vegetable/palm blends.',
    },
  },
  {
    id: 'sugar-aliases',
    category: 'sugars',
    categoryLabel: 'Hidden Sugars',
    tag: '#SugarTraps',
    readTime: '3 min read',
    title: '56 Hidden Names for Sugar: The Stealth Spike on Your Insulin',
    subtitle: '"No Added Sugar" does not mean zero glycemic impact. Here is how labels deceive.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
    statNumber: '110 GI',
    statLabel: 'Maltodextrin glycemic index (vs. pure table sugar at 65)',
    keyTakeaway: 'Maltodextrin and Invert Sugar trigger sharper glucose spikes than regular white sugar.',
    fullBody: {
      problem:
        'A packaged "protein bar" or "wellness cookie" advertises "0g Added Cane Sugar". Consumers assume it is diabetes-friendly and low glycemic. In reality, the sweetness and bulk come from maltodextrin, date paste concentrates, invert sugar syrup, and high-fructose corn syrup derivatives.',
      science:
        'Maltodextrin is a polysaccharide derived from corn or wheat starch. It is absorbed in the upper small intestine at lightning speed with a Glycemic Index of 105 to 110—significantly higher than sucrose (table sugar) at 65. It causes rapid insulin surges followed by reactive hypoglycemia and increased cravings.',
      fssaiStatus:
        'FSSAI mandates reporting of Total Sugars and Added Sugars per 100g, but complex dextrins and concentrated fruit puree solids can legally be grouped under carbohydrates or dietary binders.',
      groceryRule:
        'If ingredients end in "-ose" (maltose, dextrose, fructose) or contain "syrup", "dextrin", or "nectar", treat them metabolically as pure sugar.',
    },
  },
  {
    id: 'ins-additives-microbiome',
    category: 'additives',
    categoryLabel: 'Additives & INS',
    tag: '#GutMicrobiome',
    readTime: '2 min read',
    title: 'INS E-Numbers Decoded: What MSG & Preservatives Do to Your Gut',
    subtitle: 'Which chemical additives are harmless extracts, and which erode the mucosal barrier.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=700&q=80',
    statNumber: '450+',
    statLabel: 'Chemical food additives catalogued by FSSAI Codex Alimentarius',
    keyTakeaway: 'Emulsifiers like INS 466 & INS 433 dissolve the protective gut mucus layer in rodent models.',
    fullBody: {
      problem:
        'Packaged foods stay shelf-stable for 12 months thanks to synthetic preservatives (INS 211 Sodium Benzoate, INS 202 Potassium Sorbate) and synthetic emulsifiers (INS 471, INS 433 Polysorbate 80). Consumers see unfamiliar INS codes and cannot tell if they are natural spices or petroleum derivatives.',
      science:
        'Certain emulsifiers act like household detergents on the intestinal wall: they emulsify the hydrophobic inner mucosal lining, allowing bacteria to translocate closer to the gut epithelium and triggering low-grade bowel inflammation and microbial dysbiosis.',
      fssaiStatus:
        'FSSAI defines Good Manufacturing Practice (GMP) limits and acceptable daily intake (ADI) levels in mg/kg. However, cumulative exposure from consuming multiple processed items across breakfast, snacks, and dinner is not factored into single-item caps.',
      groceryRule:
        'Prioritize foods with short, recognizable ingredient lists. Natural emulsifiers like sunflower lecithin (INS 322) are far gentler on the gut than synthetic polysorbates.',
    },
  },
  {
    id: 'upf-3-second-rule',
    category: 'gut',
    categoryLabel: 'Modern Biohacking',
    tag: '#UltraProcessed',
    readTime: '2 min read',
    title: 'The 3-Second UPF Test: Spotting Ultra-Processed Foods Instantly',
    subtitle: 'The NOVA scale simplified for fast, no-nonsense supermarket decisions.',
    image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=700&q=80',
    statNumber: '24%',
    statLabel: 'Higher risk of systemic metabolic dysfunction tied to 4+ UPF servings/day',
    keyTakeaway: 'If it contains 5+ ingredients you cannot buy in a standard grocery pantry, it is a Class 4 UPF.',
    fullBody: {
      problem:
        'Modern ultra-processed foods (UPFs) are hyper-palatable formulations engineered with exact ratios of salt, sugar, and fat to bypass satiety signaling in the brain. They represent over 60% of modern calories in urban households.',
      science:
        'The NOVA classification groups foods into 4 categories: Unprocessed, Culinary Ingredients, Processed, and Ultra-Processed. Class 4 foods undergo industrial extrusion, de-flavoring, re-flavoring with aroma compounds, and cosmetic coloring, stripping natural food matrix benefits.',
      fssaiStatus:
        'India is actively considering front-of-pack warning labels (FOPNL) to alert consumers about high sugar, salt, and saturated fat levels, bringing Indian standards closer to global best practices.',
      groceryRule:
        'Follow Michael Pollan’s golden principle: "Don’t eat anything your great-grandmother wouldn’t recognize as food."',
    },
  },
];

export const FoodSafetyArticles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'additives' | 'sugars' | 'gut' | 'truth'>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filteredArticles =
    selectedCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  const openArticle = (article: Article) => {
    sounds.playClick();
    setActiveArticle(article);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      {/* Eye-Catching New-Gen Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full mac-secondary-btn text-emerald-800 text-xs font-bold shadow-xs">
            <Flame className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="tracking-wide">UNFILTERED FOOD INTELLIGENCE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            What Brands Don't Print <br className="hidden sm:inline" />
            <span className="text-emerald-600">On The Front of the Box.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Zero corporate PR. Science-backed investigations into hidden additives, deceptive health halos, and nutritional biology.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-end">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            All Buzz
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('truth');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'truth'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            Palm Oil Truth
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('sugars');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'sugars'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            Hidden Sugars
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('additives');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'additives'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            INS Numbers
          </button>
        </div>
      </div>

      {/* Modern Bento Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => openArticle(article)}
            className="glass-card hover:glass-card-glow rounded-[32px] overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between border border-white/80"
          >
            {/* Visual Thumbnail & Badge */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Specular Top Reflection */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300 font-mono text-[10px] font-bold">
                  {article.tag}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-[10px] flex items-center space-x-1 font-medium">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              {/* Impact Stat Badge on Image Bottom */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="font-mono font-black text-sm text-emerald-700 block leading-tight">
                      {article.statNumber}
                    </span>
                    <span className="text-[10px] text-slate-600 block line-clamp-1 font-medium">
                      {article.statLabel}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                  {article.categoryLabel}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors mt-0.5 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {article.subtitle}
                </p>
              </div>

              {/* Key Takeaway Chip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5 truncate pr-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{article.keyTakeaway}</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex-shrink-0 group-hover:underline">
                  Read Takeaway
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal (Apple macOS Sequoia Sheet Style) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[36px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Specular Top Reflection */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

            {/* Apple Circle Dismiss Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveArticle(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 z-20 shadow-xs"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Header info */}
            <div className="space-y-2 relative z-10 pr-8">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                  {activeArticle.tag}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeArticle.readTime}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {activeArticle.subtitle}
              </p>
            </div>

            {/* Stat Callout Banner */}
            <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/90 flex items-center space-x-3.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-mono font-black text-lg shadow-sm flex-shrink-0">
                {activeArticle.statNumber}
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Key Investigation Metric
                </span>
                <span className="text-xs font-semibold text-slate-800 block">
                  {activeArticle.statLabel}
                </span>
              </div>
            </div>

            {/* Article Sections */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span>The Front-of-Pack Deception</span>
                </span>
                <p className="text-slate-600 text-xs leading-normal">
                  {activeArticle.fullBody.problem}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>The Nutritional Biology</span>
                </span>
                <p className="text-slate-600 text-xs leading-normal">
                  {activeArticle.fullBody.science}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs text-blue-800">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>FSSAI Regulatory Perspective</span>
                </span>
                <p className="text-slate-600 text-xs leading-normal">
                  {activeArticle.fullBody.fssaiStatus}
                </p>
              </div>

              {/* Actionable Supermarket Rule */}
              <div className="p-4 rounded-2xl bg-emerald-500 text-white space-y-1 shadow-md shadow-emerald-600/30">
                <span className="font-black text-white flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Smart Grocery Rule of Thumb</span>
                </span>
                <p className="text-white/90 text-xs leading-normal font-medium">
                  {activeArticle.fullBody.groceryRule}
                </p>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 relative z-10">
              <span className="text-[11px] font-mono text-slate-400">
                FINEPRINT · Verified Investigation
              </span>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveArticle(null);
                }}
                className="py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

