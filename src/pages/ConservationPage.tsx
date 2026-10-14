import React, { useState } from 'react';
import { CONSERVATION_STORIES } from '../data/conservationStories';
import { 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Leaf, 
  Droplets, 
  BookOpen, 
  ChevronRight,
  Info
} from 'lucide-react';

export const ConservationPage: React.FC = () => {
  const [activeStoryId, setActiveStoryId] = useState<string>(CONSERVATION_STORIES[0].id);
  const activeStory = CONSERVATION_STORIES.find(s => s.id === activeStoryId) || CONSERVATION_STORIES[0];

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-[#1b3425] pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
            <HeartHandshake className="w-4 h-4" />
            <span>Human-Wildlife Coexistence & Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel'] text-white">
            Warli Wisdom & Forest Coexistence
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
            Discover the millennia-old relationship between Mumbai's indigenous Warli tribal communities, the sacred leopard deity Waghoba, and the forest that keeps 18 million citizens alive.
          </p>
        </div>

        {/* Story Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONSERVATION_STORIES.map((story) => {
            const isSelected = story.id === activeStory.id;
            return (
              <button
                key={story.id}
                onClick={() => setActiveStoryId(story.id)}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#13281c] border-emerald-500 shadow-xl ring-1 ring-emerald-500/40 text-white'
                    : 'bg-[#0b1610] border-[#1b3425] text-neutral-300 hover:bg-[#0f2117] hover:border-[#284f37]'
                }`}
              >
                <div>
                  <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                    {story.readTime}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {story.title}
                  </h3>
                  <div className="text-xs text-neutral-400 font-serif mb-2">
                    {story.marathiTitle}
                  </div>
                </div>
                <div className="text-xs text-neutral-400 line-clamp-2">
                  {story.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Story Deep-Dive */}
        <div className="bg-[#0b1610] rounded-3xl border border-[#1b3425] overflow-hidden shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src={activeStory.image}
              alt={activeStory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] via-[#0b1610]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-3 inline-block">
                {activeStory.category.toUpperCase()}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Cinzel']">
                {activeStory.title}
              </h2>
              <div className="text-sm text-neutral-300 mt-1 font-medium">
                {activeStory.subtitle}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Quote Block */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#060e09] border border-[#1b3826] text-sm sm:text-base italic text-emerald-200/95 font-serif leading-relaxed">
              "{activeStory.quote.text}"
              <span className="block mt-2 font-sans not-italic text-xs text-neutral-400 font-semibold">
                — {activeStory.quote.author}
              </span>
            </div>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {activeStory.fullStory.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="p-6 rounded-2xl bg-[#09150e] border border-[#1b3826] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Conservation & Cultural Takeaways</span>
              </h3>
              <ul className="space-y-2 text-xs text-neutral-300">
                {activeStory.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
